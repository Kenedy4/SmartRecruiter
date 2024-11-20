import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addQuestion } from '../../redux/slices/questionSlice';

const QuestionForm = ({ assessmentId }) => {
  const [type, setType] = useState('multiple_choice');
  const [text, setText] = useState('');
  const [choices, setChoices] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const questionData = {
      assessmentId,
      type,
      text,
      choices: choices.split(','), // Split choices by comma for multiple options
      correctAnswer,
    };
    dispatch(addQuestion(questionData));
  };

  return (
    <div className="question-form">
      <h3>Set Questions</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Assessment ID"
          value={assessmentId}
          readOnly
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="multiple_choice">Multiple Choice</option>
          <option value="open_ended">Open Ended</option>
        </select>
        <textarea
          placeholder="Question Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <input
          type="text"
          placeholder="Choices (comma separated)"
          value={choices}
          onChange={(e) => setChoices(e.target.value)}
          disabled={type !== 'multiple_choice'}
        />
        <input
          type="text"
          placeholder="Correct Answer"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
        />
        <button type="submit">Set Questions</button>
      </form>
    </div>
  );
};

export default QuestionForm;
