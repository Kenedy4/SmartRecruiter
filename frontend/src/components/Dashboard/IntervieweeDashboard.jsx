import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssessmentsForInterviewee } from '../../redux/slices/assessmentSlice';
import { useNavigate } from 'react-router-dom';
// import Sidebar from '../Shared/Sidebar';
import api from '../../services/api';

const IntervieweeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { intervieweeAssessments = [], intervieweeStatus, error } = useSelector((state) => state.assessment);

  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [submissionId, setSubmissionId] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      dispatch(fetchAssessmentsForInterviewee());
      fetchPendingInvitations();
    }
  }, [dispatch, navigate]);

  const fetchPendingInvitations = async () => {
    try {
      const response = await api.get('/invitations');
      setPendingInvitations(response.data.data.filter((i) => i.status === 'pending'));
    } catch (err) {
      console.error('Error fetching invitations:', err);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      await api.put(`/interviewee/invitations/${invitationId}/accept`);
      alert('Invitation accepted!');
      fetchPendingInvitations();
    } catch (err) {
      console.error('Error accepting invitation:', err);
      alert('Failed to accept invitation.');
    }
  };

  const fetchFeedback = async () => {
    if (!submissionId) {
      setFeedbackError('Please enter a valid Submission ID.');
      return;
    }

    try {
      const response = await api.get(`/feedback/${submissionId}`);
      setFeedback(response.data.data || []);
      setFeedbackError('');
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setFeedbackError('Failed to fetch feedback. Please check the Submission ID.');
    }
  };

  const handleStartAssessment = (assessmentId) => {
    navigate(`/assessment/${assessmentId}/start`);
  };

  const handleSubmitAssessment = (assessmentId) => {
    alert(`Submit assessment logic for assessment ID ${assessmentId} will be implemented here!`);
  };

  return (
    <div className="interviewee-dashboard">
      <h1>Interviewee Dashboard</h1>

      <h2>Your Assessments</h2>
      {intervieweeStatus === 'loading' && <p>Loading assessments...</p>}
      {intervieweeStatus === 'failed' && <p className="error">Error loading assessments: {error?.message || error}</p>}
      {intervieweeStatus === 'succeeded' && (
        intervieweeAssessments.length > 0 ? (
          <ul className="assessment-list">
            {intervieweeAssessments.map((assessment) => (
              <li key={assessment.id}>
                <p>{assessment.title || 'Untitled Assessment'}</p>
                <button onClick={() => handleStartAssessment(assessment.id)}>Start Assessment</button>
                <button onClick={() => handleSubmitAssessment(assessment.id)}>Submit Assessment</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No assessments available at this time.</p>
        )
      )}

      <h2>Pending Invitations</h2>
      {pendingInvitations.length > 0 ? (
        <ul className="invitation-list">
          {pendingInvitations.map((invitation) => (
            <li key={invitation.id}>
              <p>Assessment ID: {invitation.assessment_id}</p>
              <p>
                {typeof invitation.msg === 'string'
                  ? invitation.msg
                  : JSON.stringify(invitation.msg) || 'No message'}
              </p>
              <button onClick={() => handleAcceptInvitation(invitation.id)}>Accept Invitation</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending invitations.</p>
      )}

      <h2>Feedback</h2>
      <div className="feedback-management">
        <label>
          Submission ID:
          <input
            type="number"
            value={submissionId}
            onChange={(e) => setSubmissionId(e.target.value)}
            placeholder="Enter Submission ID"
          />
        </label>
        <button onClick={fetchFeedback} className="btn btn-secondary">
          View Feedback
        </button>
      </div>

      {feedbackError && <p className="error">{feedbackError}</p>}

      {feedback.length > 0 ? (
        <div className="feedback-list">
          <h3>Feedback for Submission {submissionId}</h3>
          <ul>
            {feedback.map((fb) => (
              <li key={fb.id}>
                <p>{fb.text}</p>
                <p>Score: {fb.score}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No feedback available yet.</p>
      )}
    </div>
  );
};

export default IntervieweeDashboard;
