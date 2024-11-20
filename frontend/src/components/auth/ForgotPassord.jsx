import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    try {
      const response = await authService.forgotPassword(email);
      setStatus('success');
      alert(response.data.message); // Notify the user that a reset email has been sent
      navigate('/login'); // Redirect to login after sending the reset email
    } catch (err) {
      setStatus('failed');
      setError(err.response ? err.response.data.message : 'An error occurred');
    }
  };

  const handleCancel = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="forgot-password">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <div className="form-actions">
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending...' : 'Reset Password'}
          </button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
      {status === 'success' && <p className="success">Password reset instructions sent. Check your email.</p>}
    </div>
  );
};

export default ForgotPassword;
