import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchQuestions = createAsyncThunk('question/fetchQuestions', async (assessmentId) => {
  const response = await api.get(`/assessments/${assessmentId}/questions`);
  return response.data;
});

export const addQuestion = createAsyncThunk('question/addQuestion', async ({ assessmentId, questionData }) => {
  const response = await api.post(`/assessments/${assessmentId}/questions`, questionData);
  return response.data;
});

const questionSlice = createSlice({
  name: 'question',
  initialState: {
    questions: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.questions.push(action.payload);
      });
  },
});

export default questionSlice.reducer;
