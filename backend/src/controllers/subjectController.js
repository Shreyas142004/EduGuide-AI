const Subject = require('../models/Subject');
const Performance = require('../models/Performance');
const Document = require('../models/Document');

// @desc    Get all subjects for current user
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id }).sort({ name: 1 });
    res.status(200).json({
      success: true,
      subjects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private
const createSubject = async (req, res, next) => {
  try {
    const { name, code } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Subject name is required' });
    }

    const existing = await Subject.findOne({ userId: req.user.id, name: name.trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Subject already exists' });
    }

    const subject = await Subject.create({
      userId: req.user.id,
      name: name.trim(),
      code: code ? code.trim() : '',
    });

    res.status(201).json({
      success: true,
      subject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private
const updateSubject = async (req, res, next) => {
  try {
    const { name, code } = req.body;
    const subject = await Subject.findOne({ _id: req.params.id, userId: req.user.id });

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    if (name) subject.name = name.trim();
    if (code !== undefined) subject.code = code.trim();

    await subject.save();

    res.status(200).json({
      success: true,
      subject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private
const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, userId: req.user.id });
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    await Subject.deleteOne({ _id: subject._id });
    await Performance.deleteMany({ userId: req.user.id, subjectId: subject._id });
    await Document.deleteMany({ userId: req.user.id, subjectId: subject._id });

    res.status(200).json({
      success: true,
      message: 'Subject and related records deleted',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
};
