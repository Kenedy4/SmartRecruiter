import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchAssessmentDetail } from '../../redux/slices/assessmentSlice';

const AssessmentDetail = () => {
  const { id } = useParams(); // Retrieve `id` from route params
  const dispatch = useDispatch();

  // Access the Redux state
  const { currentAssessment, status, error } = useSelector((state) => state.assessment);

  // Fetch the assessment details when the component mounts
  useEffect(() => {
    dispatch(fetchAssessmentDetail(id));
  }, [dispatch, id]);

  // Handle loading and error states
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className="assessment-detail">
      <h1>Assessment Detail</h1>
      {currentAssessment ? (
        <div>
          <p><strong>Title:</strong> {currentAssessment.title}</p>
          <p><strong>Description:</strong> {currentAssessment.description}</p>
          <p><strong>Time Limit:</strong> {currentAssessment.timeLimit} minutes</p>
          <p><strong>Published:</strong> {currentAssessment.isPublished ? 'Yes' : 'No'}</p>
        </div>
      ) : (
        <p>No details available for this assessment.</p>
      )}
    </div>
  );
};

export default AssessmentDetail;
