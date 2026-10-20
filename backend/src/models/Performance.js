const mongoose = require('mongoose');

const topicScoreSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ['Weak', 'Moderate', 'Strong', 'Excellent'],
    default: 'Moderate',
  },
  lastTestedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const performanceSchema = new mongoose.Schema({
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
  examScore: {
    type: Number,
    required: true,
    default: 0,
  },
  maxScore: {
    type: Number,
    required: true,
    default: 100,
  },
  previousScore: {
    type: Number,
    default: 0,
  },
  assignmentScore: {
    type: Number,
    default: 0,
  },
  quizScore: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  priority: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    default: 'MEDIUM',
  },
  topicScores: [topicScoreSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

performanceSchema.index({ userId: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model('Performance', performanceSchema);
