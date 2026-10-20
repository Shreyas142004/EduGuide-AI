const mongoose = require('mongoose');

const sessionItemSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
  priority: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    default: 'MEDIUM',
  },
  focusTopics: [{
    type: String,
    trim: true,
  }],
  actionableTasks: [{
    type: String,
    trim: true,
  }],
  completed: {
    type: Boolean,
    default: false,
  },
}, { _id: true });

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String,
    required: true, // format: YYYY-MM-DD
  },
  sessions: [sessionItemSchema],
  totalStudyTime: {
    type: Number, // total minutes planned
    required: true,
  },
  completedTime: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Archived'],
    default: 'Active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

studyPlanSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
