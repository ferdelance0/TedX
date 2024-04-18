import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FeedbackForm = () => {
  const { eventId } = useParams();
  const [feedbackQuestions, setFeedbackQuestions] = useState([]);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:3000/events/${eventId}/feedbackquestions`)
      .then((response) => {
        console.log('hello!');
        setFeedbackQuestions(response.data.feedbackQuestions);
      })
      .catch((error) => {
        console.error('Error fetching feedback questions:', error);
      });
  }, [eventId]);

  const handleResponseChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`/events/${eventId}/feedbackresponses`, {
        participantId: 'participant123', // Replace with actual participant ID
        responses: Object.values(responses),
      });
      // Show success message or redirect
    } catch (error) {
      console.error('Error submitting feedback responses:', error);
    }
  };

  return (
    <div className="page-container">
      <h2>Feedback Form</h2>
      <form onSubmit={handleSubmit}>
        {feedbackQuestions.map((question) => (
          <div key={question._id}>
            <label>{question.question}</label>
            {question.inputType === 'short' && (
              <input
                type="text"
                value={responses[question._id] || ''}
                onChange={(e) =>
                  handleResponseChange(question._id, e.target.value)
                }
                required
              />
            )}
            {question.inputType === 'long' && (
              <textarea
                value={responses[question._id] || ''}
                onChange={(e) =>
                  handleResponseChange(question._id, e.target.value)
                }
                required
              ></textarea>
            )}
            {question.inputType === 'rating' && (
              <select
                value={responses[question._id] || ''}
                onChange={(e) =>
                  handleResponseChange(question._id, e.target.value)
                }
                required
              >
                <option value="">Select rating</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            )}
          </div>
        ))}
        <button className="content-button" type="submit">
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
