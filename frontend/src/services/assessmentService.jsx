import api from './api';

const fetchAssessments = () => api.get('/assessments');
const createAssessment = (data) => api.post('/assessments', data);
const updateAssessment = (id, data) => api.put(`/assessments/${id}`, data);
const deleteAssessment = (id) => api.delete(`/assessments/${id}`);

export default { fetchAssessments, createAssessment, updateAssessment, deleteAssessment };
