import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import assessmentReducer from './slices/assessmentSlice';
import questionReducer from './slices/questionSlice';
import invitationReducer from './slices/invitationSlice';
import notificationReducer from './slices/notificationSlice';
import performanceReducer from './slices/performanceSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    assessment: assessmentReducer,
    question: questionReducer,
    invitation: invitationReducer,
    notification: notificationReducer,
    performance: performanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true, // Catch non-serializable data issues
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

export default store;
