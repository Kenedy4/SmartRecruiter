import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssessments } from '../../redux/slices/assessmentSlice';
import { useNavigate } from 'react-router-dom';

const AssessmentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { assessments, status, error } = useSelector((state) => state.assessment);

  useEffect(() => {
    dispatch(fetchAssessments());
  }, [dispatch]);

  return (
    <div className="assessment-list">
      <h2>Assessment List</h2>
      {status === 'loading' && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {assessments.map((assessment) => (
          <li key={assessment.id}>
            <p>{assessment.title}</p>
            <button onClick={() => navigate(`/assessment/${assessment.id}`)}>View Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssessmentList;
