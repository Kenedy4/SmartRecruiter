import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssessments } from '../../redux/slices/assessmentSlice';
import { useNavigate } from 'react-router-dom';
import PerformanceSection from '../Performance/PerformanceSection';
import api from '../../services/api';
import Modal from 'react-modal';

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state for assessments
  const { assessments, status, error } = useSelector((state) => state.assessment);

  // Local state for feedback and invitations
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackScore, setFeedbackScore] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [submissionError, setSubmissionError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [invitationPage, setInvitationPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAssessments());
    fetchInvitations(invitationPage);
  }, [dispatch, invitationPage]);

  // Fetch invitations with pagination
  const fetchInvitations = async (page) => {
    try {
      const response = await api.get(`/invitations?page=${page}`);
      setInvitations(response.data.data || []);
    } catch (err) {
      console.error('Error fetching invitations:', err);
    }
  };

  // Send invitations to interviewees
  const sendInvitation = async (assessmentId, intervieweeIds) => {
    try {
      await api.post('/invitations', { assessment_id: assessmentId, interviewee_ids: intervieweeIds });
      alert('Invitations sent successfully!');
      fetchInvitations(invitationPage);
    } catch (err) {
      console.error('Error sending invitations:', err);
      alert('Failed to send invitations.');
    }
  };

  // Fetch feedback for a specific submission
  const fetchFeedback = async (submissionId) => {
    if (!submissionId) {
      setSubmissionError('Please enter a valid Submission ID.');
      return;
    }

    try {
      const response = await api.get(`/feedback/${submissionId}`);
      setFeedback(response.data.data || []);
      setSubmissionError(''); // Clear any existing error
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setSubmissionError('Unable to fetch feedback. Please check the Submission ID.');
    }
  };

  // Handle feedback form submission
  const handleFeedbackSubmit = async () => {
    if (!selectedSubmission) {
      setSubmissionError('Please enter a Submission ID.');
      return;
    }

    if (!feedbackText || !feedbackScore) {
      setSubmissionError('Please fill in all fields.');
      return;
    }

    try {
      await api.post(`/feedback/${selectedSubmission}`, {
        text: feedbackText,
        score: feedbackScore,
      });

      alert('Feedback submitted successfully!');
      setFeedbackText('');
      setFeedbackScore('');
      setSelectedSubmission('');
      setSubmissionError('');
      setIsModalOpen(false);

      // Refresh feedback after submission
      fetchFeedback(selectedSubmission);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setSubmissionError('Failed to submit feedback. Please try again.');
    }
  };

  // Handle opening and closing the feedback modal
  const openModal = (submissionId) => {
    setSelectedSubmission(submissionId || '');
    setIsModalOpen(true);
    setSubmissionError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFeedbackText('');
    setFeedbackScore('');
    setSubmissionError('');
  };

  return (
    <div className="recruiter-dashboard">
      <h1>Recruiter Dashboard</h1>

      {/* Button to create a new assessment */}
      <button onClick={() => navigate('/assessment')} className="btn btn-primary">
        Create New Assessment
      </button>

      {/* Assessments Section */}
      <h2>Assessments</h2>
      {status === 'loading' && <p>Loading assessments...</p>}
      {error && <p className="error">{error}</p>}
      {assessments && assessments.length > 0 ? (
        //Redner assesmnets list
        <ul className="assessment-list">
          {assessments.map((assessment) => (
            <li key={assessment.id}>
              <p>{assessment.title}</p>
              <button onClick={() => navigate(`/assessment/${assessment.id}`)}>View Details</button>
              <button onClick={() => sendInvitation(assessment.id, [1, 2])}>Send Invitations</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assessments available.</p>
      )}

      {/* Invitations Section */}
      <h2>Invitations</h2>
      {invitations.length > 0 ? (
        <ul className="invitation-list">
          {invitations.map((invitation) => (
            <li key={invitation.id}>
              <p>Assessment ID: {invitation.assessment_id}</p>
              <p>Status: {invitation.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No invitations available.</p>
      )}
      <button onClick={() => setInvitationPage(Math.max(1, invitationPage - 1))}>Previous Page</button>
      <button onClick={() => setInvitationPage(invitationPage + 1)}>Next Page</button>

      {/* Feedback Management Section */}
      <h2>Feedback Management</h2>
      <div className="feedback-management">
        <label>
          Submission ID:
          <input
            type="number"
            value={selectedSubmission}
            onChange={(e) => setSelectedSubmission(e.target.value)}
            placeholder="Enter Submission ID"
          />
        </label>
        <button onClick={() => fetchFeedback(selectedSubmission)} className="btn btn-secondary">
          View Feedback
        </button>
      </div>

      {submissionError && <p className="error">{submissionError}</p>}

      {feedback.length > 0 && (
        <div className="feedback-list">
          <h3>Feedback for Submission {selectedSubmission}</h3>
          <ul>
            {feedback.map((fb) => (
              <li key={fb.id}>
                <p>{fb.text}</p>
                <p>Score: {fb.score}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal for Providing Feedback */}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="feedback-modal">
        <h2>Provide Feedback</h2>
        <label>
          Feedback Text:
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Enter your feedback"
          />
        </label>
        <label>
          Score:
          <input
            type="number"
            value={feedbackScore}
            onChange={(e) => setFeedbackScore(e.target.value)}
            placeholder="Enter score (e.g., 10)"
          />
        </label>
        {submissionError && <p className="error">{submissionError}</p>}
        <button onClick={handleFeedbackSubmit} className="btn btn-success">
          Submit Feedback
        </button>
        <button onClick={closeModal} className="btn btn-secondary">
          Cancel
        </button>
      </Modal>

      {/* Performance Section */}
      <PerformanceSection />
    </div>
  );
};

export default RecruiterDashboard;
