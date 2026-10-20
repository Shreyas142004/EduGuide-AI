const axios = require('axios');
const env = require('../config/env');
const logger = require('../utils/logger');

const nlpClient = axios.create({
  baseURL: env.nlpServiceUrl,
  timeout: 120000, // 2 minutes timeout for embedding generation or LLM synthesis
});

const nlpService = {
  checkHealth: async () => {
    try {
      const response = await nlpClient.get('/nlp/health');
      return response.data;
    } catch (error) {
      logger.warn(`NLP Service health check failed: ${error.message}`);
      return { status: 'down', error: error.message };
    }
  },

  processDocument: async ({ documentId, filePath, filename, fileType, subjectId, subjectName }) => {
    try {
      logger.info(`Sending document processing request to NLP service: ${filename}`);
      const response = await nlpClient.post('/nlp/process-document', {
        document_id: documentId.toString(),
        file_path: filePath,
        filename,
        file_type: fileType,
        subject_id: subjectId.toString(),
        subject_name: subjectName || 'General',
      });
      return response.data;
    } catch (error) {
      logger.error(`NLP processDocument error: ${error.message}`);
      throw new Error(error.response?.data?.detail || 'Failed to process document in NLP service');
    }
  },

  chat: async ({ message, subjectId, subjectName, documentId, studentContext = {}, history = [] }) => {
    try {
      const response = await nlpClient.post('/nlp/chat', {
        message,
        subject_id: subjectId ? subjectId.toString() : null,
        subject_name: subjectName || null,
        document_id: documentId ? documentId.toString() : null,
        student_context: studentContext,
        history,
      });
      return response.data;
    } catch (error) {
      logger.error(`NLP chat error: ${error.message}`);
      throw new Error(error.response?.data?.detail || 'Failed to generate academic response');
    }
  },

  generateQuiz: async ({ subjectId, subjectName, documentId, topic, count = 5, difficulty = 'Medium' }) => {
    try {
      const response = await nlpClient.post('/nlp/generate-quiz', {
        subject_id: subjectId ? subjectId.toString() : null,
        subject_name: subjectName || null,
        document_id: documentId ? documentId.toString() : null,
        topic,
        count,
        difficulty,
      });
      return response.data;
    } catch (error) {
      logger.error(`NLP generateQuiz error: ${error.message}`);
      throw new Error(error.response?.data?.detail || 'Failed to generate quiz');
    }
  },

  extractTopics: async ({ documentId, filePath, subjectId }) => {
    try {
      const response = await nlpClient.post('/nlp/extract-topics', {
        document_id: documentId ? documentId.toString() : null,
        file_path: filePath,
        subject_id: subjectId ? subjectId.toString() : null,
      });
      return response.data;
    } catch (error) {
      logger.error(`NLP extractTopics error: ${error.message}`);
      return { topics: [] };
    }
  },
};

module.exports = nlpService;
