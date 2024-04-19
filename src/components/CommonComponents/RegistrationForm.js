//RegistrationForm.js
import '../../styles/adminStyles.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
Modal.setAppElement('#root');
const RegistrationForm = () => {
  const { eventId } = useParams();
  const [eventExists, setEventExists] = useState(false);
  const [registrationFields, setRegistrationFields] = useState([]);
  const [participantData, setParticipantData] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // Check if the event exists in the event table
    axios
      .get(`http://localhost:3000/events/${eventId}`)
      .then((response) => {
        if (response.data.event) {
          setEventExists(true);
          setRegistrationFields(response.data.event.eventregistrationfields);
          setParticipantData({ eventId });
        } else {
          return <div>Event not found.</div>;
        }
      })
      .catch((error) => {
        console.error('Error checking event existence:', error);
      });
  }, [eventId]);

  const handleInputChange = (field, value) => {
    setParticipantData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new participant model on the server
    axios
      .post('http://localhost:3000/createParticipantModel', {
        eventId,
        registrationFields,
      })
      .then(() => {
        // Register the participant
        axios
          .post('http://localhost:3000/registerParticipant', {
            eventId,
            registrationFields,
            participantData,
          })
          .then((response) => {
            console.log('Participant registered:', response.data.participant);
            // Reset form data or redirect to a success page
            setShowSuccessModal(true);
          })
          .catch((error) => {
            console.error('Error registering participant:', error);
          });
      })
      .catch((error) => {
        console.error('Error creating participant model:', error);
      });
  };

  return (
    <>
      <div className="page-container">
        <h2 className="page-title">Registration Form</h2>
        <form onSubmit={handleSubmit}>
          {registrationFields.map((field) => (
            <div key={field.label} className="form-group">
              <label>{field.label}</label>
              {field.inputType === 'text' && (
                <input
                  type="text"
                  name={field.label}
                  value={participantData[field.label] || ''}
                  onChange={(e) =>
                    handleInputChange(field.label, e.target.value)
                  }
                  required
                />
              )}
              {field.inputType === 'number' && (
                <input
                  type="number"
                  name={field.label}
                  value={participantData[field.label] || ''}
                  onChange={(e) =>
                    handleInputChange(field.label, e.target.value)
                  }
                  required
                />
              )}
              {field.inputType === 'email' && (
                <input
                  type="email"
                  name={field.label}
                  value={participantData[field.label] || ''}
                  onChange={(e) =>
                    handleInputChange(field.label, e.target.value)
                  }
                  required
                />
              )}
              {field.inputType === 'date' && (
                <input
                  type="date"
                  name={field.label}
                  value={participantData[field.label] || ''}
                  onChange={(e) =>
                    handleInputChange(field.label, e.target.value)
                  }
                  required
                />
              )}
              {field.inputType === 'file' && (
                <input
                  type="file"
                  name={field.label}
                  onChange={(e) =>
                    handleInputChange(field.label, e.target.files[0])
                  }
                  required
                />
              )}
              {/* Add more input types as needed */}
            </div>
          ))}
          <div className="button-container">
            <button type="submit" className="content-button">
              Submit
            </button>
          </div>
        </form>

        <Modal
          isOpen={showSuccessModal}
          onRequestClose={() => setShowSuccessModal(false)}
          style={customModalStyles}
          contentLabel="Success Modal"
        >
          <h2>Success!</h2>
          <p>You have been registered for this event!</p>
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
    </>
  );
};

export default RegistrationForm;