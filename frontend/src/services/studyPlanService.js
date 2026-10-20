import api from './api';

export const studyPlanService = {
  getStudyPlan: async () => {
    const res = await api.get('/study-plan');
    return res.data;
  },
  generatePlan: async () => {
    const res = await api.post('/study-plan/generate');
    return res.data;
  },
  updateSessionStatus: async (planId, sessionId, completed) => {
    const res = await api.put(`/study-plan/${planId}`, { sessionId, completed });
    return res.data;
  },
  emailPlan: async () => {
    const res = await api.post('/study-plan/email');
    return res.data;
  },
};

export default studyPlanService;
