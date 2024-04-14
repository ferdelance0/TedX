// PollQuestionForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PollQuestionForm = () => {
  const { eventId } = useParams();
  const [pollQuestions, setPollQuestions] = useState([]);
  const [pollAnswers, setPollAnswers] = useState({});

  useEffect(() => {
    // Fetch poll questions from the backend based on the event ID
    axios
      .get(`http://localhost:3000/events/${eventId}/pollquestions`)
      .then((response) => {
        console.log('hello!');
        setPollQuestions(response.data.pollQuestions);
      })
      .catch((error) => {
        console.error('Error fetching poll questions:', error);
      });
  }, [eventId]);

  const handleOptionChange = (questionIndex, optionIndex) => {
    setPollAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send poll answers to the backend
    axios
      .post(
        `http://localhost:3000/events/${eventId}/pollresponses`,
        pollAnswers
      )
      .then((response) => {
        console.log('Poll responses submitted:', response.data);
        // Reset form data or redirect to a success page
      })
      .catch((error) => {
        console.error('Error submitting poll responses:', error);
      });
  };

  return (
    <div>
      <h2>Poll Questions</h2>
      <form onSubmit={handleSubmit}>
        {pollQuestions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <h3>{question.question}</h3>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <label>
                  <input
                    type="radio"
                    name={`question-${questionIndex}`}
                    value={optionIndex}
                    checked={pollAnswers[questionIndex] === optionIndex}
                    onChange={() =>
                      handleOptionChange(questionIndex, optionIndex)
                    }
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PollQuestionForm;
