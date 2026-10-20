const mongoose = require('mongoose');

const topicResultSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    default: '',
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  userAnswer: {
    type: Number,
    required: true,
  },
  correctAnswer: {
    type: Number,
    required: true,
  },
  explanation: {
    type: String,
    default: '',
  },
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  topicResults: [topicResultSchema],
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
