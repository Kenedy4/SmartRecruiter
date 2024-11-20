import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import InvitationsAPI from '../../services/invitationService'; // Importing the service

// Fetch invitations from the API
export const fetchInvitations = createAsyncThunk(
  'invitations/fetchInvitations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await InvitationsAPI.getInvitations(); // Fetching invitations from the API
      return response.data; // Assuming the API response contains a `data` field with invitations
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch invitations'); // Handle errors gracefully
    }
  }
);

// Accept invitation API call
export const acceptInvitation = createAsyncThunk(
  'invitations/acceptInvitation',
  async (invitationId, { rejectWithValue }) => {
    try {
      const response = await InvitationsAPI.acceptInvitation(invitationId); // Accepting the invitation via API
      return response.data; // Assuming the response contains the updated invitation
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to accept invitation'); // Handle errors gracefully
    }
  }
);

// Invitation slice
const invitationSlice = createSlice({
  name: 'invitations',
  initialState: {
    invitations: [], // Stores the list of invitations
    status: 'idle', // Tracks the fetch status
    error: null, // Tracks any errors
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch invitations
      .addCase(fetchInvitations.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Reset errors during the fetch
      })
      .addCase(fetchInvitations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Filter for pending invitations and store them
        state.invitations = action.payload.data.filter((inv) => inv.status === 'pending');
      })
      .addCase(fetchInvitations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch invitations'; // Set error messages
      })

      // Accept invitation
      .addCase(acceptInvitation.pending, (state) => {
        state.error = null; // Reset errors during the accept action
      })
      .addCase(acceptInvitation.fulfilled, (state, action) => {
        const index = state.invitations.findIndex((inv) => inv.id === action.payload.id);
        if (index !== -1) {
          state.invitations[index].status = 'accepted'; // Update the invitation's status to "accepted"
        }
      })
      .addCase(acceptInvitation.rejected, (state, action) => {
        state.error = action.payload || 'Failed to accept invitation'; // Set error messages
      });
  },
});

export default invitationSlice.reducer;
