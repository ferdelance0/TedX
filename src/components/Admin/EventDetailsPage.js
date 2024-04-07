// EventDetailsPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticipantsTable from '../Admin/ParticipantsTable';
import '../../styles/adminStyles.css';
import '../../styles/eventDetailsPageStyles.css';

const EventDetailsPage = () => {
  const handlePreview = (item) => {
    // Handle preview logic for the specified item
    console.log(`Preview ${item}`);
  };

  const handleSendLink = (item) => {
    // Handle send link logic for the specified item
    console.log(`Send link for ${item}`);
  };

  const navigate = useNavigate();
  const [eventStatus, setEventStatus] = useState('upcoming');

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const handleToggleStatus = () => {
    setEventStatus((prevStatus) =>
      prevStatus === 'upcoming' ? 'completed' : 'upcoming'
    );
  };

  return (
    <div className="main-container">
      <div className="main-content">
        <div className="underNav">
          <button
            className="back-to-home-btn content-button"
            onClick={handleBackToDashboard}
          >
            Back To Dashboard
          </button>
        </div>
        <div className="event-details-container container-fluid d-grid">
          <div className="event-details-header">
            <h2 className="event-title">Event Title</h2>
            <div className="event-status-toggle">
              <span
                onClick={handleToggleStatus}
                className={`status ${eventStatus}`}
              >
                {eventStatus}
              </span>
            </div>
          </div>
          <div className="event-description">
            <p>Event description goes here...</p>
          </div>
          <div className="container d-flex">
            <div className="col-lg-8 col-md-12 participants-list ">
              <ParticipantsTable />
            </div>
            <div
              style={{ backgroundColor: '#f9f9f9' }}
              className="col-lg-4 col-md-12 controls-section d-grid"
            >
              <div className="control-item">
                <h4>Registration Form</h4>
                <button
                  className="preview-btn"
                  onClick={() => handlePreview('Registration Field')}
                >
                  Preview
                </button>
                <button
                  className="send-link-btn"
                  onClick={() => handleSendLink('Registration Field')}
                >
                  Send Link
                </button>
              </div>
              <div className="control-item">
                <h4>ID Card</h4>
                <button
                  className="preview-btn"
                  onClick={() => handlePreview('ID Card')}
                >
                  Preview
                </button>
                <button
                  className="send-link-btn"
                  onClick={() => handleSendLink('ID Card')}
                >
                  Send Link
                </button>
              </div>
              <div className="control-item">
                <h4>Poll</h4>
                <button
                  className="preview-btn"
                  onClick={() => handlePreview('Poll')}
                >
                  Preview
                </button>
                <button
                  className="send-link-btn"
                  onClick={() => handleSendLink('Poll')}
                >
                  Send Link
                </button>
              </div>
              <div className="control-item">
                <h4>Feedback</h4>
                <button
                  className="preview-btn"
                  onClick={() => handlePreview('Feedback')}
                >
                  Preview
                </button>
                <button
                  className="send-link-btn"
                  onClick={() => handleSendLink('Feedback')}
                >
                  Send Link
                </button>
              </div>
              <div className="control-item">
                <h4>Certificate</h4>
                <button
                  className="preview-btn"
                  onClick={() => handlePreview('Certificate')}
                >
                  Preview
                </button>
                <button
                  className="send-link-btn"
                  onClick={() => handleSendLink('Certificate')}
                >
                  Send Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
