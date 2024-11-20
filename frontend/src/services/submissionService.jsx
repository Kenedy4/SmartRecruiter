import api from './api';

export const submitAssessment = async (assessmentId, submissionData) => {
  const response = await api.post(`/interviewee/assessments/${assessmentId}/submit`, submissionData);
  return response.data;
};
