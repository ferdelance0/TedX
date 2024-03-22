import React, { useState } from 'react';
import Modal from './modal';

const AdminDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);

  const handleCreateEvent = (eventData) => {
    setEvents([...events, { ...eventData, status: 'upcoming' }]);
    setShowModal(false);
  };

  const handleToggleEventStatus = (index, newStatus) => {
    const updatedEvents = [...events];
    updatedEvents[index].status = newStatus;
    setEvents(updatedEvents);
  };

  return (
    <div className="admin-dashboard">
      <div className="event-section">
        <h2 className="event-section-title">Upcoming Events</h2>
        <div className="event-cards">
          {events
            .filter((event) => event.status === 'upcoming')
            .map((event, index) => (
              <div key={index} className="event-card">
                <div className="event-card-header">
                  <h3 className="event-card-title">{event.name}</h3>
                  <button
                    className="event-status-toggle"
                    onClick={() => handleToggleEventStatus(index, 'active')}
                  >
                    Mark as Active
                  </button>
                </div>
                <p>Location: {event.location}</p>
                {/* Add other event details */}
              </div>
            ))}
        </div>
      </div>

      <div className="event-section">
        <h2 className="event-section-title">Active Events</h2>
        <div className="event-cards">
          {events
            .filter((event) => event.status === 'active')
            .map((event, index) => (
              <div key={index} className="event-card">
                <div className="event-card-header">
                  <h3 className="event-card-title">{event.name}</h3>
                  <button
                    className="event-status-toggle"
                    onClick={() => handleToggleEventStatus(index, 'completed')}
                  >
                    Mark as Completed
                  </button>
                </div>
                <p>Location: {event.location}</p>
                {/* Add other event details */}
              </div>
            ))}
        </div>
      </div>

      <div className="event-section">
        <h2 className="event-section-title">Completed Events</h2>
        <div className="event-cards">
          {events
            .filter((event) => event.status === 'completed')
            .map((event, index) => (
              <div key={index} className="event-card">
                <h3 className="event-card-title">{event.name}</h3>
                <p>Location: {event.location}</p>
                {/* Add other event details */}
              </div>
            ))}
        </div>
      </div>

      <button className="add-event-btn" onClick={() => setShowModal(true)}>
        +
      </button>

      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onCreateEvent={handleCreateEvent}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
