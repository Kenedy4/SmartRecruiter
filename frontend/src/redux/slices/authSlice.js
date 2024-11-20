import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // Ensure this is properly configured for Axios

// Async Thunks

// Login User
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/login', credentials);
    const { token, role } = response.data;
    localStorage.setItem('token', token); // Save token in localStorage
    return { token, role };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
    return rejectWithValue(errorMessage);
  }
});

// Signup User
export const signupUser = createAsyncThunk('auth/signupUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/signup', userData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
    return rejectWithValue(errorMessage);
  }
});

// Logout User
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await api.post('/logout');
    localStorage.removeItem('token'); // Clear token from localStorage
    return true;
  } catch (error) {
    const errorMessage = "Logout failed. Please try again.";
    return rejectWithValue(errorMessage);
  }
});

// Forgot Password
export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to send password reset email.";
    return rejectWithValue(errorMessage);
  }
});

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/reset-password/${token}`, { newPassword });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to reset password.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
    passwordResetStatus: null, // For tracking password reset status
    isAuthenticated: false,    // To track login state
    role: null,                // Store user role
    token: null,               // Store token
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Login failed. Please try again.";
      })

      // Signup Cases
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Signup failed. Please try again.";
      })

      // Logout Cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.token = null; // Clear token
        state.role = null; // Clear role
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload || "Logout failed.";
      })

      // Forgot Password Cases
      .addCase(forgotPassword.pending, (state) => {
        state.passwordResetStatus = 'loading';
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.passwordResetStatus = 'succeeded';
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.passwordResetStatus = 'failed';
        state.error = action.payload || "Failed to send password reset email.";
      })

      // Reset Password Cases
      .addCase(resetPassword.pending, (state) => {
        state.passwordResetStatus = 'loading';
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.passwordResetStatus = 'succeeded';
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordResetStatus = 'failed';
        state.error = action.payload || "Failed to reset password.";
      });
  },
});

export default authSlice.reducer;
