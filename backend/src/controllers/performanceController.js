const Performance = require('../models/Performance');
const Subject = require('../models/Subject');
const performanceService = require('../services/performanceService');
const { calculateSubjectPriority } = require('../services/weaknessService');

// @desc    Get student performances
// @route   GET /api/performance
// @access  Private
const getPerformances = async (req, res, next) => {
  try {
    const performances = await Performance.find({ userId: req.user.id })
      .populate('subjectId', 'name code')
      .sort({ percentage: 1 });

    res.status(200).json({
      success: true,
      performances,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update performance entry
// @route   POST /api/performance
// @access  Private
const upsertPerformance = async (req, res, next) => {
  try {
    const { subjectId, examScore, maxScore, previousScore, assignmentScore, quizScore } = req.body;

    if (!subjectId) {
      return res.status(400).json({ success: false, message: 'Subject ID is required' });
    }

    if (examScore === undefined || examScore === null) {
      return res.status(400).json({ success: false, message: 'Exam score is required' });
    }

    const performance = await performanceService.upsertPerformance(req.user.id, {
      subjectId,
      examScore,
      maxScore: maxScore || 100,
      previousScore,
      assignmentScore,
      quizScore,
    });

    res.status(200).json({
      success: true,
      message: 'Academic performance updated successfully',
      performance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update topic performance manually or after testing
// @route   POST /api/performance/:subjectId/topics
// @access  Private
const updateTopicPerformance = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { topic, percentage } = req.body;

    if (!topic || percentage === undefined) {
      return res.status(400).json({ success: false, message: 'Topic name and percentage are required' });
    }

    let performance = await Performance.findOne({ userId: req.user.id, subjectId });
    if (!performance) {
      return res.status(404).json({ success: false, message: 'Performance record for this subject not found' });
    }

    const pct = Number(percentage);
    const status = pct >= 75 ? 'Strong' : pct >= 60 ? 'Moderate' : 'Weak';

    const existingIdx = performance.topicScores.findIndex(
      t => t.topic.toLowerCase() === topic.trim().toLowerCase()
    );

    if (existingIdx >= 0) {
      performance.topicScores[existingIdx].percentage = pct;
      performance.topicScores[existingIdx].status = status;
      performance.topicScores[existingIdx].lastTestedAt = new Date();
    } else {
      performance.topicScores.push({
        topic: topic.trim(),
        percentage: pct,
        status,
        lastTestedAt: new Date(),
      });
    }

    await performance.save();

    res.status(200).json({
      success: true,
      performance,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPerformances,
  upsertPerformance,
  updateTopicPerformance,
};
