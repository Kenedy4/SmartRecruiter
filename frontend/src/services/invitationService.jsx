import api from './api';

const InvitationsAPI = {
  // Fetch invitations with optional pagination
  getInvitations: async (page = 1, perPage = 10) => {
    const response = await api.get(`/invitations?page=${page}&per_page=${perPage}`);
    return response.data;
  },

  // Fetch all invitations without pagination (if needed)
  fetchAllInvitations: async () => {
    const response = await api.get('/invitations');
    return response.data;
  },

  // Create a new invitation or multiple invitations
  createInvitation: async (invitationData) => {
    const response = await api.post(`/invitations`, invitationData);
    return response.data;
  },

  // Accept an invitation by ID
  acceptInvitation: async (invitationId) => {
    const response = await api.put(`/interviewee/invitations/${invitationId}/accept`);
    return response.data;
  },
};

export default InvitationsAPI;
