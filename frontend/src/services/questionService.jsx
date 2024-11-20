import api from './api';

const fetchQuestions = (assessmentId) => api.get(`/assessments/${assessmentId}/questions`);
const addQuestion = (assessmentId, data) => api.post(`/assessments/${assessmentId}/questions`, data);

export default { fetchQuestions, addQuestion };
