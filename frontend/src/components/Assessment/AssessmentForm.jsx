import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAssessment } from '../../redux/slices/assessmentSlice';

const AssessmentForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recruiterId, setRecruiterId] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const assessmentData = { title, description, recruiterId, timeLimit, isPublished };
    dispatch(createAssessment(assessmentData));
  };

  return (
    <div className="assessment-form">
      <h2>Create Assessment Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          type="text"
          placeholder="Recruiter ID"
          value={recruiterId}
          onChange={(e) => setRecruiterId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Time Limit (minutes)"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          required
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            placeholder="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          <span>Review and Publish</span>
          {/* <small className="helper-text">(Check to publish this assessment)</small> */}
        </label>
        <button type="submit">Create Assessment</button>
      </form>
    </div>
  );
};

export default AssessmentForm;
