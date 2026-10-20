const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./src/config/env');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const subjectRoutes = require('./src/routes/subjectRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const performanceRoutes = require('./src/routes/performanceRoutes');
const analysisRoutes = require('./src/routes/analysisRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const studyPlanRoutes = require('./src/routes/studyPlanRoutes');
const quizRoutes = require('./src/routes/quizRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static folder for uploaded materials
app.use('/uploads', express.static(env.uploadDir));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'EduGuide AI Backend',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/study-plan', studyPlanRoutes);
app.use('/api/quiz', quizRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = env.port || 5000;
const server = app.listen(PORT, () => {
  logger.info(`EduGuide AI Backend server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
});

module.exports = { app, server };
