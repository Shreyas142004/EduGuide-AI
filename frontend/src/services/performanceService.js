import api from './api';

export const performanceService = {
  // Subjects
  getSubjects: async () => {
    const res = await api.get('/subjects');
    return res.data;
  },
  createSubject: async (name, code = '') => {
    const res = await api.post('/subjects', { name, code });
    return res.data;
  },
  deleteSubject: async (id) => {
    const res = await api.delete(`/subjects/${id}`);
    return res.data;
  },

  // Performance Records
  getPerformances: async () => {
    const res = await api.get('/performance');
    return res.data;
  },
  upsertPerformance: async (data) => {
    const res = await api.post('/performance', data);
    return res.data;
  },
  updateTopicScore: async (subjectId, topic, percentage) => {
    const res = await api.post(`/performance/${subjectId}/topics`, { topic, percentage });
    return res.data;
  },

  // Academic Weakness Analysis
  getOverview: async () => {
    const res = await api.get('/analysis/overview');
    return res.data;
  },
  getWeakSubjects: async () => {
    const res = await api.get('/analysis/weak-subjects');
    return res.data;
  },
  getTopics: async () => {
    const res = await api.get('/analysis/topics');
    return res.data;
  },
};

export default performanceService;
