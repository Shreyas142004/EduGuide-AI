const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const quizService = require('../services/quizService');

// @desc    Generate a new quiz for a subject/topic
// @route   POST /api/quiz/generate
// @access  Private
const generateQuiz = async (req, res, next) => {
  try {
    const { subjectId, topic, count, difficulty } = req.body;

    if (!subjectId) {
      return res.status(400).json({ success: false, message: 'Please select a subject' });
    }

    const quiz = await quizService.createQuiz({
      userId: req.user.id,
      subjectId,
      topic: topic || 'Comprehensive Review',
      count: count ? Number(count) : 5,
      difficulty: difficulty || 'Medium',
    });

    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit answers for a quiz, get graded score, and update topic performance
// @route   POST /api/quiz/:id/submit
// @access  Private
const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers array is required' });
    }

    const result = await quizService.submitQuiz({
      userId: req.user.id,
      quizId: req.params.id,
      answers,
    });

    res.status(200).json({
      success: true,
      message: 'Quiz submitted and evaluated successfully',
      result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's quiz attempt history
// @route   GET /api/quiz/history
// @access  Private
const getQuizHistory = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user.id })
      .populate('subjectId', 'name code')
      .populate('quizId', 'topic')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      attempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a quiz by ID
// @route   GET /api/quiz/:id
// @access  Private
const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('subjectId', 'name code');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateQuiz,
  submitQuiz,
  getQuizHistory,
  getQuizById,
};
