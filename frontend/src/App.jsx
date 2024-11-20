import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import RecruiterPage from './pages/RecruiterPage';
import IntervieweePage from './pages/IntervieweePage';
import AssessmentForm from './components/Assessment/AssessmentForm';
import AssessmentDetail from './components/Assessment/AssessmentDetail';
import SubmitAssessment from './components/Assessment/SubmitAssessment';
import AssessmentList from './components/Assessment/AssessmentList';
import AnswerForm from './components/Assessment/AnswerForm';
import Invitations from './components/Invitation/Invitations';
import InvitationList from './components/Invitation/InvitationList';
import IntervieweeList from './components/Invitation/IntervieweeList';
import IntervieweeDetails from './components/Invitation/IntervieweeDetails';
import QuestionForm from './components/Assessment/QuestionForm';
import Notifications from './components/Shared/Notifications';
import PerformanceSection from './components/Performance/PerformanceSection';
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';

const App = () => {
  return (
    <>
      <Navbar />
      <div className="app-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Recruiter Routes */}
          <Route path="/recruiter-dashboard" element={<RecruiterPage />} />
          <Route path="/assessment" element={<AssessmentForm />} />
          <Route path="/assessment/:id" element={<AssessmentDetail />} />
          <Route path="/assessment/:id/submit" element={<SubmitAssessment />} />
          <Route path="/assessments" element={<AssessmentList />} />
          <Route path="/assessment/:id/questions" element={<QuestionForm />} />
          <Route path="/assessment/:id/answers" element={<AnswerForm />} />
          <Route path="/assessment/:id/invitations" element={<Invitations />} />
          <Route path="/assessment/:id/notifications" element={<Notifications />} />
          <Route path="/performance" element={<PerformanceSection />} />

          {/* Interviewee Routes */}
          <Route path="/interviewee-dashboard" element={<IntervieweePage />} />
          <Route path="/interviewees" element={<IntervieweeList />} />
          <Route path="/interviewees/:id" element={<IntervieweeDetails />} />

          {/* Invitation Management */}
          <Route path="/invitations" element={<InvitationList />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
