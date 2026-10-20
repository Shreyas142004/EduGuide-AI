const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const Subject = require('../models/Subject');
const nlpService = require('../services/nlpService');
const logger = require('../utils/logger');

// @desc    Upload and process an academic document (PDF, DOCX, TXT)
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a file to upload' });
    }

    const { subjectId, newSubjectName, newSubjectCode } = req.body;
    let subject = null;

    if (subjectId && subjectId !== 'NEW_SUBJECT') {
      subject = await Subject.findOne({ _id: subjectId, userId: req.user.id });
    }

    if (!subject && newSubjectName && newSubjectName.trim()) {
      subject = await Subject.create({
        userId: req.user.id,
        name: newSubjectName.trim(),
        code: newSubjectCode ? newSubjectCode.trim().toUpperCase() : '',
      });
      logger.info(`Auto-created new subject "${subject.name}" for student ${req.user.id}`);
    }

    if (!subject) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Please select an existing subject or provide a new subject name.' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
    const validTypes = ['pdf', 'docx', 'txt'];
    if (!validTypes.includes(ext)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Only PDF, DOCX, and TXT files are supported' });
    }

    // Create initial Document record in MongoDB with 'Uploading' status
    const document = await Document.create({
      userId: req.user.id,
      subjectId: subject._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType: ext,
      filePath: req.file.path,
      fileSize: req.file.size,
      processingStatus: 'Processing',
    });

    // Asynchronously call Python NLP Service to extract, chunk, embed, and index
    // We can await it so the client gets immediate feedback or update status
    try {
      logger.info(`Starting Python NLP processing for doc ${document._id}...`);
      const nlpResult = await nlpService.processDocument({
        documentId: document._id,
        filePath: req.file.path,
        filename: req.file.originalname,
        fileType: ext,
        subjectId: subject._id,
        subjectName: subject.name,
      });

      document.processingStatus = 'Ready';
      document.pageCount = nlpResult.page_count || nlpResult.pages || 1;
      document.chunkCount = nlpResult.chunk_count || nlpResult.chunks || 0;
      document.extractedTopics = nlpResult.extracted_topics || [];
      await document.save();

      res.status(201).json({
        success: true,
        message: 'Document successfully processed and indexed for academic retrieval',
        document,
      });
    } catch (nlpError) {
      logger.error(`NLP Processing failed for document ${document._id}: ${nlpError.message}`);
      document.processingStatus = 'Failed';
      document.errorMessage = nlpError.message;
      await document.save();

      return res.status(500).json({
        success: false,
        message: `Document processing failed: ${nlpError.message}`,
        document,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all documents for current user
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res, next) => {
  try {
    const { subjectId } = req.query;
    const query = { userId: req.user.id };
    if (subjectId) {
      query.subjectId = subjectId;
    }

    const documents = await Document.find(query)
      .populate('subjectId', 'name code')
      .sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get document details
// @route   GET /api/documents/:id
// @access  Private
const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('subjectId', 'name code');

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, userId: req.user.id });
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Remove file from disk
    if (fs.existsSync(document.filePath)) {
      try {
        fs.unlinkSync(document.filePath);
      } catch (err) {
        logger.warn(`Could not delete file from disk: ${err.message}`);
      }
    }

    await Document.deleteOne({ _id: document._id });

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};
