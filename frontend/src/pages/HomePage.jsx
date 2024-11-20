import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Shared/Sidebar';

const HomePage = () => {
  const navigate = useNavigate();


  return (
    <div className="home-container"> {/* Applied home-container class */}
      <div className="home-page">
        <h1>Welcome to Smart Recruiter</h1>
        <p>Latest Jobs in Kenya & Career Advice for You!
          Smart Recruiter is a leading job site where we post latest job vacancies in Kenya. 
          Are you looking for your next job? Register today for free job alerts. Looking to hire the best? 
          Its FREE. Post your Kenyan job & reach over 500,000 qualified professionals in Kenya.

</p>
        <div className="home-actions">
          <button onClick={() => navigate('/signup')}>Sign Up</button>
          <button onClick={() => navigate('/login')}>Log In</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
