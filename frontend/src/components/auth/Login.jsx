import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await dispatch(loginUser(values));
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/dashboard'); // Redirect to dashboard on successful login
      } else if (result.payload) {
        console.error("Login Error:", result.payload);
      }
    } catch (err) {
      console.error("Unexpected Error:", err.message);
    } finally {
      setSubmitting(false); // Ensure the form resets the submission state
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Username Field */}
            <div className="form-group">
              <Field name="username" placeholder="Username" className="input" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="input"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || status === 'loading'}
              className="btn"
            >
              {status === 'loading' ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>

      {/* Error Display */}
      {error && <p className="error">{typeof error === 'string' ? error : 'An error occurred.'}</p>}
    </div>
  );
};

export default Login;
