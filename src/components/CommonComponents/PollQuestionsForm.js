// PollQuestionForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/adminStyles.css';

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

  // PollQuestionForm.js
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert pollAnswers to the expected format
    const pollResponses = {
      participantId: 'YOUR_PARTICIPANT_ID', // Replace with the actual participant ID
      responses: Object.values(pollAnswers),
    };

    // Send poll answers to the backend
    axios
      .post(
        `http://localhost:3000/events/${eventId}/pollresponses`,
        pollResponses
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
    <div className="main-content">
      <div className="page-container">
        <h1 className="page-title">Poll Questions</h1>
        <form onSubmit={handleSubmit}>
          {pollQuestions.map((question, questionIndex) => (
            <div key={questionIndex} className="poll-question">
              <h4>{question.question}</h4>
              <div className="poll-options">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="poll-option">
                    <label>
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={optionIndex}
                        checked={pollAnswers[questionIndex] === optionIndex}
                        onChange={() =>
                          handleOptionChange(questionIndex, optionIndex)
                        }
                        className="poll-option-radio"
                      />
                      <span className="poll-option-label">{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button className="content-button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PollQuestionForm;
