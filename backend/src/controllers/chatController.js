const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const Subject = require('../models/Subject');
const Performance = require('../models/Performance');
const Document = require('../models/Document');
const nlpService = require('../services/nlpService');
const { analyzeStudentWeaknesses } = require('../services/weaknessService');
const logger = require('../utils/logger');

// @desc    Send a message to the AI Academic Assistant
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { sessionId, message, subjectId, documentId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    let session;
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, userId: req.user.id });
    }

    let subject = null;
    if (subjectId) {
      subject = await Subject.findOne({ _id: subjectId, userId: req.user.id });
    }

    let document = null;
    if (documentId) {
      document = await Document.findOne({ _id: documentId, userId: req.user.id });
    }

    if (!session) {
      // Create a descriptive title based on the first few words of the student's question
      const title = message.trim().length > 40
        ? `${message.trim().substring(0, 37)}...`
        : message.trim();

      session = await ChatSession.create({
        userId: req.user.id,
        title,
        subjectId: subject ? subject._id : null,
        documentId: document ? document._id : null,
      });
    } else {
      // Update session filters if passed
      if (subjectId && !session.subjectId) session.subjectId = subjectId;
      if (documentId && !session.documentId) session.documentId = documentId;
      session.updatedAt = new Date();
      await session.save();
    }

    // Save user message
    const userMsg = await ChatMessage.create({
      sessionId: session._id,
      role: 'user',
      content: message.trim(),
    });

    // Gather student personalization context
    const performances = await Performance.find({ userId: req.user.id });
    const subjects = await Subject.find({ userId: req.user.id });
    const weaknessAnalysis = analyzeStudentWeaknesses(performances, subjects);

    const highPrioritySubjects = weaknessAnalysis.highPriority.map(s => s.subjectName);
    const weakTopicsList = [];
    performances.forEach(p => {
      (p.topicScores || []).filter(t => t.percentage < 60).forEach(t => weakTopicsList.push(t.topic));
    });

    const studentContext = {
      student_name: req.user.name,
      course: req.user.course,
      semester: req.user.semester,
      daily_study_time: req.user.dailyStudyTime,
      exam_date: req.user.examDate ? req.user.examDate.toISOString().split('T')[0] : null,
      high_priority_subjects: highPrioritySubjects,
      weak_topics: weakTopicsList,
    };

    // Retrieve previous messages for conversation history
    const previousMessages = await ChatMessage.find({ sessionId: session._id })
      .sort({ createdAt: 1 })
      .limit(10);

    const history = previousMessages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    // Call Python NLP microservice for RAG response
    const nlpResponse = await nlpService.chat({
      message: message.trim(),
      subjectId: subject ? subject._id : (session.subjectId || null),
      subjectName: subject ? subject.name : null,
      documentId: document ? document._id : (session.documentId || null),
      studentContext,
      history,
    });

    // Save assistant message with retrieved sources
    const assistantMsg = await ChatMessage.create({
      sessionId: session._id,
      role: 'assistant',
      content: nlpResponse.answer || "I could not generate an answer at this time.",
      sources: (nlpResponse.sources || []).map(s => ({
        filename: s.filename || 'Document',
        pageNumber: s.page_number || s.pageNumber || 1,
        excerpt: s.excerpt || '',
        subject: s.subject || '',
        score: s.score || 0,
      })),
    });

    res.status(200).json({
      success: true,
      sessionId: session._id,
      userMessage: userMsg,
      assistantMessage: assistantMsg,
      suggestedQuestions: nlpResponse.suggested_questions || [
        "Explain this topic simply.",
        "Explain this as a 10-mark answer.",
        "Give me an example.",
        "Give me important questions from this chapter.",
        "Test me on this topic.",
      ],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all chat sessions for user
// @route   GET /api/chat/sessions
// @access  Private
const getSessions = async (req, res, next) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user.id })
      .populate('subjectId', 'name code')
      .populate('documentId', 'originalName filename')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get session details and all messages
// @route   GET /api/chat/sessions/:id
// @access  Private
const getSessionById = async (req, res, next) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('subjectId', 'name code')
      .populate('documentId', 'originalName filename');

    if (!session) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }

    const messages = await ChatMessage.find({ sessionId: session._id }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      session,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete chat session
// @route   DELETE /api/chat/sessions/:id
// @access  Private
const deleteSession = async (req, res, next) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user.id });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }

    await ChatMessage.deleteMany({ sessionId: session._id });
    await ChatSession.deleteOne({ _id: session._id });

    res.status(200).json({
      success: true,
      message: 'Chat session deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getSessions,
  getSessionById,
  deleteSession,
};
