import React from 'react';
import Sidebar from '../components/Shared/Sidebar';
import IntervieweeDashboard from '../components/Dashboard/IntervieweeDashboard';

const IntervieweePage = () => {
  return (
    <div className="interviewee-page">
      <Sidebar role="interviewee" />
      <div className="dashboard-content">
        <IntervieweeDashboard /> 
      </div>
    </div>
  );
};

export default IntervieweePage;
