const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  pageNumber: {
    type: Number,
    default: 1,
  },
  excerpt: {
    type: String,
    default: '',
  },
  subject: {
    type: String,
    default: '',
  },
  score: {
    type: Number,
    default: 0,
  },
}, { _id: false });

const chatMessageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatSession',
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sources: [sourceSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
