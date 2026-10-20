import api from './api';

export const quizService = {
  generateQuiz: async (subjectId, topic = '', count = 5, difficulty = 'Medium') => {
    const res = await api.post('/quiz/generate', { subjectId, topic, count, difficulty });
    return res.data;
  },
  submitQuiz: async (quizId, answers) => {
    const res = await api.post(`/quiz/${quizId}/submit`, { answers });
    return res.data;
  },
  getQuizHistory: async () => {
    const res = await api.get('/quiz/history');
    return res.data;
  },
  getQuizById: async (id) => {
    const res = await api.get(`/quiz/${id}`);
    return res.data;
  },
};

export default quizService;
