import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { signupUser } from '../../redux/slices/authSlice';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const initialValues = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'interviewee', // Default role
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    role: Yup.string().oneOf(['recruiter', 'interviewee'], 'Invalid role').required('Role is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await dispatch(signupUser(values));
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/login'); // Redirect to login page on successful signup
      }
    } catch (err) {
      console.error('Signup failed:', err.message);
    } finally {
      setSubmitting(false); // Reset submission state
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="signup-form">
            <div className="form-group">
              <Field
                name="firstName"
                placeholder="First Name"
                className="input"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <Field
                name="lastName"
                placeholder="Last Name"
                className="input"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <Field
                name="username"
                placeholder="Username"
                className="input"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className="input"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="input"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <Field as="select" name="role" className="select">
                <option value="recruiter">Recruiter</option>
                <option value="interviewee">Interviewee</option>
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="error"
              />
            </div>

            <button
              type="submit"
              className="btn"
              disabled={isSubmitting || status === 'loading'}
            >
              {status === 'loading' ? 'Signing up...' : 'Signup'}
            </button>
          </Form>
        )}
      </Formik>

      {/* Error Display */}
      {error && (
        <p className="error">
          {typeof error === 'string' ? error : 'An unexpected error occurred.'}
        </p>
      )}
    </div>
  );
};

export default Signup;
