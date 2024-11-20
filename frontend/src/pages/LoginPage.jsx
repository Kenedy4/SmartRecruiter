import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../redux/slices/authSlice';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, role } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ username, password })).unwrap();

      // Navigate based on user role after successful login
      if (result.role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else if (result.role === 'interviewee') {
        navigate('/interviewee-dashboard');
      } else {
        console.error('Unexpected role:', result.role);
      }
    } catch (err) {
      console.error('Login failed:', err.message);
    }
  };

  return (
    <div className="login-container">
      {/* Optional background image or branding */}
      <div className="login-header"></div>

      <h2>User Login</h2>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="input"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input"
            required
          />
        </div>

        <button type="submit" className="btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Feedback Messages */}
      {status === 'loading' && <p>Loading...</p>}
      {error && (
        <p className="error">
          {typeof error === 'string' ? error : 'An unexpected error occurred.'}
        </p>
      )}

      {/* Forgot Password Link */}
      <p>
        Forgot Password? <Link to="/reset-password">Reset Password</Link>
      </p>
    </div>
  );
};

export default LoginPage;
