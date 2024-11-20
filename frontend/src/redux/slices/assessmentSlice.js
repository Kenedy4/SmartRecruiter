import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch all assessments (recruiter view)
export const fetchAssessments = createAsyncThunk(
  'assessment/fetchAssessments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/assessments');
      return response?.data?.data || []; // Ensure a fallback to an empty array if data is undefined
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch assessments.');
    }
  }
);


// Fetch assessments for interviewees
export const fetchAssessmentsForInterviewee = createAsyncThunk(
  'assessment/fetchAssessmentsForInterviewee',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/interviewee/assessments');
      return response.data.assessments; // Adjust based on API response format
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch interviewee assessments.');
    }
  }
);

// Fetch details of a single assessment
export const fetchAssessmentDetail = createAsyncThunk(
  'assessment/fetchAssessmentDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/assessments/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch assessment details.');
    }
  }
);

// Create a new assessment
export const createAssessment = createAsyncThunk(
  'assessment/createAssessment',
  async (assessmentData, { getState, rejectWithValue }) => {
    try {
      const state = getState(); // Access the Redux state
      const token = state.auth.token; // Assuming token is stored in auth slice
      const response = await api.post('/assessments', assessmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create assessment.');
    }
  }
);

// Update an existing assessment
export const updateAssessment = createAsyncThunk(
  'assessment/updateAssessment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/assessments/${id}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update assessment.');
    }
  }
);

// Delete an assessment
export const deleteAssessment = createAsyncThunk(
  'assessment/deleteAssessment',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/assessments/${id}`);
      return id; // Return ID to remove from local state
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete assessment.');
    }
  }
);

// Slice definition
const assessmentSlice = createSlice({
  name: 'assessment',
  initialState: {
    assessments: [], // Shared state for all assessments
    intervieweeAssessments: [], // Specific state for interviewee assessments
    currentAssessment: null, // Current selected assessment
    status: 'idle', // Status for recruiter-related actions
    detailStatus: 'idle', // Status for fetching a single assessment
    intervieweeStatus: 'idle', // Status for interviewee-specific assessments
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all assessments (recruiter)
      .addCase(fetchAssessments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssessments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assessments = action.payload;
      })
      .addCase(fetchAssessments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch interviewee-specific assessments
      .addCase(fetchAssessmentsForInterviewee.pending, (state) => {
        state.intervieweeStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchAssessmentsForInterviewee.fulfilled, (state, action) => {
        state.intervieweeStatus = 'succeeded';
        state.intervieweeAssessments = action.payload;
      })
      .addCase(fetchAssessmentsForInterviewee.rejected, (state, action) => {
        state.intervieweeStatus = 'failed';
        state.error = action.payload;
      })

      // Fetch assessment details
      .addCase(fetchAssessmentDetail.pending, (state) => {
        state.detailStatus = 'loading';
        state.error = null;
        state.currentAssessment = null;
      })
      .addCase(fetchAssessmentDetail.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.currentAssessment = action.payload;
      })
      .addCase(fetchAssessmentDetail.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload;
      })

      // Create a new assessment
      .addCase(createAssessment.fulfilled, (state, action) => {
        state.assessments.push(action.payload);
      })

      // Update an assessment
      .addCase(updateAssessment.fulfilled, (state, action) => {
        const index = state.assessments.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.assessments[index] = action.payload;
        }
      })

      // Delete an assessment
      .addCase(deleteAssessment.fulfilled, (state, action) => {
        state.assessments = state.assessments.filter((a) => a.id !== action.payload);
      });
  },
});

export default assessmentSlice.reducer;
