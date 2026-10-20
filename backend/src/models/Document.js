const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  filename: {
    type: String,
    required: true,
    trim: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'docx', 'txt'],
  },
  filePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    default: 0,
  },
  processingStatus: {
    type: String,
    enum: ['Uploading', 'Processing', 'Indexing', 'Ready', 'Failed'],
    default: 'Uploading',
  },
  pageCount: {
    type: Number,
    default: 0,
  },
  chunkCount: {
    type: Number,
    default: 0,
  },
  extractedTopics: [{
    type: String,
    trim: true,
  }],
  errorMessage: {
    type: String,
    default: null,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Document', documentSchema);
