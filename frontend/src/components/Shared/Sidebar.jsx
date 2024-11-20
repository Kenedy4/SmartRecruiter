import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return null; // Do not render the sidebar if the user is not logged in
  }

  // Render links based on user role
  const renderLinksForRecruiter = () => (
    <>
      <li>
        <NavLink
          to="/create-assessment"
          className={({ isActive }) => (isActive ? 'active sidebar-link' : 'sidebar-link')}
        >
          Create Assessment
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/notifications"
          className={({ isActive }) => (isActive ? 'active sidebar-link' : 'sidebar-link')}
        >
          Notifications
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/feedback"
          className={({ isActive }) => (isActive ? 'active sidebar-link' : 'sidebar-link')}
        >
          Feedback
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/interviewees"
          className={({ isActive }) => (isActive ? 'active sidebar-link' : 'sidebar-link')}
        >
          Interviewees
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/send-invitation"
          className={({ isActive }) => (isActive ? 'active sidebar-link' : 'sidebar-link')}
        >
          Send Invitation
        </NavLink>
      </li>
    </>
  );

  const renderLinksForInterviewee = () => (
    <>
      <li>
        <NavLink
          to="/assessments"
          className={({ isActive }) => (isActive ? 'active sidebar-link' : 'sidebar-link')}
        >
          My Assessments
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/feedback"
          className={({ isActive }) => (isActive ? 'active sidebar-link' : 'sidebar-link')}
        >
          Feedback
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/notifications"
          className={({ isActive }) => (isActive ? 'active sidebar-link' : 'sidebar-link')}
        >
          Notifications
        </NavLink>
      </li>
    </>
  );

  const renderLinks = () => {
    if (user.role === 'recruiter') {
      return renderLinksForRecruiter();
    }
    if (user.role === 'interviewee') {
      return renderLinksForInterviewee();
    }
    console.warn('Unrecognized user role:', user.role);
    return <li className="sidebar-link">Unrecognized role</li>;
  };

  return (
    <aside className="sidebar">
      <ul className="sidebar-links">
        <li>
          <NavLink
            to={`/${user.role}-dashboard`}
            className={({ isActive }) => (isActive ? 'active sidebar-link' : 'sidebar-link')}
          >
            Dashboard
          </NavLink>
        </li>
        {renderLinks()}
      </ul>
    </aside>
  );
};

export default Sidebar;
