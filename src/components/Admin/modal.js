import React, { useState } from 'react';
import '../../styles/adminStyles.css';
const Modal = ({ onClose, onCreateEvent }) => {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  // Add other event details as needed

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = { name: eventName, location };
    onCreateEvent(eventData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Create Event</h2>
          <button className="close-modal-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="eventName">Event Name:</label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          {/* Add other event details input fields */}
          <button type="submit">Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
