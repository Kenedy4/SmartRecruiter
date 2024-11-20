import React, { useState } from 'react';
import { submitAssessment } from '../../services/submissionService';

const SubmitAssessment = ({ assessmentId }) => {
  const [answers, setAnswers] = useState([]);
  const handleSubmit = async () => {
    const response = await submitAssessment(assessmentId, { answers });
    console.log('Assessment submitted:', response.data);
  };

  return (
    <div>
      <h3>Submit Assessment</h3>
      {/* Render form for questions */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default SubmitAssessment;
