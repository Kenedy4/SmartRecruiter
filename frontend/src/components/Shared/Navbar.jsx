import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  };

  const handleNavigation = (role) => {
    if (!isAuthenticated) {
      console.error('Navigation blocked: User not authenticated.');
      navigate('/login'); // Redirect unauthenticated users to login
    } else if (user?.role !== role) {
      console.error(`Navigation blocked: User role mismatch (expected ${role}, found ${user?.role}).`);
      alert(`You do not have access to the ${role} dashboard.`);
    } else {
      const path = role === 'recruiter' ? '/recruiter-dashboard' : '/interviewee-dashboard';
      navigate(path);
    }
  };

  return (
    <nav className="navbar">
      {/* Navbar Logo */}
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <h1>Smart Recruiter</h1>
      </div>

      {/* Navbar Links */}
      <div className="navbar-links">
        {/* Home Link */}
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'active nav-link' : 'nav-link')}
        >
          Home
        </NavLink>

        {/* Recruiter Dashboard Link */}
        <button
          className="nav-link"
          onClick={() => handleNavigation('recruiter')}
          disabled={!isAuthenticated}
        >
          Recruiter
        </button>

        {/* Interviewee Dashboard Link */}
        <button
          className="nav-link"
          onClick={() => handleNavigation('interviewee')}
          disabled={!isAuthenticated}
        >
          Interviewee
        </button>

        {/* Logout Button */}
        {isAuthenticated && (
          <button className="nav-link logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
