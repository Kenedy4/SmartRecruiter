import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from '../redux/slices/authSlice';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'recruiter',
    gender: '',
    company_name: '',
    consent: false,
  });

  const [status, setStatus] = useState('idle'); // For loading state
  const [error, setError] = useState(null); // For error feedback

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    try {
      await dispatch(signupUser(formData)).unwrap();
      navigate('/login'); // Redirect to login page after successful signup
    } catch (err) {
      console.error('Signup failed:', err.message);
      setError(err.message || 'An unexpected error occurred during signup.');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header"></div> {/* Background image */}
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit} className="signup-form">
        {/* First Name */}
        <div className="form-group">
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="input"
          />
        </div>

        {/* Last Name */}
        <div className="form-group">
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            required
            className="input"
          />
        </div>

        {/* Username */}
        <div className="form-group">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="input"
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="input"
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="input"
          />
        </div>

        {/* Role */}
        <div className="form-group">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="select"
          >
            <option value="recruiter">Recruiter</option>
            <option value="interviewee">Interviewee</option>
          </select>
        </div>

        {/* Conditional Fields */}
        {formData.role === 'recruiter' && (
          <div className="form-group">
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Company Name"
              required
              className="input"
            />
          </div>
        )}

        {formData.role === 'interviewee' && (
          <div className="form-group">
            <label className="checkbox">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
              />
              Consent to be contacted
            </label>
          </div>
        )}

        {/* Gender */}
        <div className="form-group">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="select"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      {/* Error Feedback */}
      {error && <p className="error">{error}</p>}

      {/* Login Redirect */}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;
