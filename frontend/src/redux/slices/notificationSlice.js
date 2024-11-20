import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk('notification/fetchNotifications', async () => {
  const response = await api.get('/notifications');
  return response.data;
});

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    markAsRead: (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.is_read = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload;
    });
  },
});

export const { markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
