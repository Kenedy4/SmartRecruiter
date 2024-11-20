import React from 'react';
import Sidebar from '../components/Shared/Sidebar';
import RecruiterDashboard from '../components/Dashboard/RecruiterDashboard';

const RecruiterPage = () => {
  return (
    <div className="recruiter-page">
      <Sidebar role="recruiter" />
      <div className="dashboard-content">
        <RecruiterDashboard />
      </div>
    </div>
  );
};

export default RecruiterPage;
