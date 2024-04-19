// PollQuestionForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/adminStyles.css';
import Modal from 'react-modal';
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '500px',
    width: '100%',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};
const PollQuestionForm = () => {
  const { eventId } = useParams();
  const [pollQuestions, setPollQuestions] = useState([]);
  const [pollAnswers, setPollAnswers] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
        setShowSuccessModal(true);
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

      <Modal
        isOpen={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
        style={customModalStyles}
        contentLabel="Success Modal"
      >
        <h2>Success!</h2>
        <p>Your response has been submitted</p>
        <button
          className="content-button"
          onClick={() => {
            setShowSuccessModal(false);
            // Optionally, you can redirect to the dashboard or perform any other action
          }}
        >
          OK
        </button>
      </Modal>
    </div>
  );
};

export default PollQuestionForm;
