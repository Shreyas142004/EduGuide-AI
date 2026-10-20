const Performance = require('../models/Performance');
const Subject = require('../models/Subject');
const Document = require('../models/Document');
const { analyzeStudentWeaknesses } = require('../services/weaknessService');

// @desc    Get comprehensive academic weakness and performance overview
// @route   GET /api/analysis/overview
// @access  Private
const getOverview = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id });
    const performances = await Performance.find({ userId: req.user.id });
    const documents = await Document.find({ userId: req.user.id });

    const analysis = analyzeStudentWeaknesses(performances, subjects);

    res.status(200).json({
      success: true,
      analysis: {
        ...analysis,
        totalDocuments: documents.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weak subjects marked as HIGH priority
// @route   GET /api/analysis/weak-subjects
// @access  Private
const getWeakSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id });
    const performances = await Performance.find({ userId: req.user.id });

    const analysis = analyzeStudentWeaknesses(performances, subjects);

    res.status(200).json({
      success: true,
      weakSubjects: analysis.highPriority,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get topic-level performance metrics
// @route   GET /api/analysis/topics
// @access  Private
const getTopics = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id });
    const performances = await Performance.find({ userId: req.user.id });

    const subjectMap = new Map();
    subjects.forEach(s => subjectMap.set(s._id.toString(), s.name));

    const topicList = [];
    performances.forEach(p => {
      const sName = subjectMap.get(p.subjectId.toString()) || 'Subject';
      (p.topicScores || []).forEach(t => {
        topicList.push({
          subjectId: p.subjectId,
          subjectName: sName,
          topic: t.topic,
          percentage: t.percentage,
          status: t.status,
          lastTestedAt: t.lastTestedAt,
        });
      });
    });

    // Sort by percentage ascending (weakest topics first)
    topicList.sort((a, b) => a.percentage - b.percentage);

    const weakTopics = topicList.filter(t => t.percentage < 60);
    const moderateTopics = topicList.filter(t => t.percentage >= 60 && t.percentage < 75);
    const strongTopics = topicList.filter(t => t.percentage >= 75);

    res.status(200).json({
      success: true,
      totalTopics: topicList.length,
      weakTopics,
      moderateTopics,
      strongTopics,
      allTopics: topicList,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getWeakSubjects,
  getTopics,
};
