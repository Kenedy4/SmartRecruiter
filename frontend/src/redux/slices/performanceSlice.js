// src/redux/slices/performanceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunks to fetch data
export const fetchPerformanceStatistics = createAsyncThunk(
  "performance/fetchStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/performance/statistics");
      return response.data.monthly;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchIntervieweeComposition = createAsyncThunk(
  "performance/fetchComposition",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/interviewee/composition");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchIntervieweeStatus = createAsyncThunk(
  "performance/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/interviewee/status");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice definition
const performanceSlice = createSlice({
  name: "performance",
  initialState: {
    monthlyPerformance: [],
    intervieweeComposition: { male: 0, female: 0 },
    intervieweeStatus: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle performance statistics
    builder
      .addCase(fetchPerformanceStatistics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPerformanceStatistics.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.monthlyPerformance = action.payload;
      })
      .addCase(fetchPerformanceStatistics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Handle interviewee composition
    builder.addCase(fetchIntervieweeComposition.fulfilled, (state, action) => {
      state.intervieweeComposition = action.payload;
    });

    // Handle interviewee status
    builder.addCase(fetchIntervieweeStatus.fulfilled, (state, action) => {
      state.intervieweeStatus = action.payload;
    });
  },
});

export default performanceSlice.reducer;
