import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBars, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getEventId, getToken, removeToken } from '../../auth/auth';
import ksitmlogo from '../../images/logobanner.png';

import '../../styles/adminStyles.css';
import '../../styles/sideNavbarStyles.css';

const SecurityDashboard = () => {
  const navigate = useNavigate();
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [noParticipantsFound, setNoParticipantsFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const assignedEventIds = getEventId(token);

        const eventPromises = assignedEventIds.map(async (eventId) => {
          const eventResponse = await axios.get(`http://localhost:3000/events/${eventId}`);
          const event = eventResponse.data.event;
          const currentDate = new Date();
          const eventDate = new Date(event.eventscheduleddate);

          // Only include scheduled events
          if (eventDate >= currentDate) {
            return event;
          }
          return null;
        });

        const events = await Promise.all(eventPromises);
        const scheduledEvents = events.filter(Boolean); // Remove null values
        setScheduledEvents(scheduledEvents);

        if (scheduledEvents.length > 0) {
          setSelectedEventId(scheduledEvents[0]._id);
          fetchParticipants(scheduledEvents[0]._id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchParticipants = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:3000/events/${eventId}/participants`);
      setParticipants(response.data);
      setSelectedParticipants([]);
      setNoParticipantsFound(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setParticipants([]);
        setSelectedParticipants([]);
        setNoParticipantsFound(true);
      } else {
        console.error('Error fetching participants:', error);
      }
    }
  };

  const handleMarkAttendance = async (eventId) => {
    try {
      const token = getToken();

      await axios.post(
        `http://localhost:3000/events/${eventId}/mark-attendance`,
        {
          participantIds: selectedParticipants,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedParticipants = participants.map((participant) => {
        if (selectedParticipants.includes(participant._id)) {
          return { ...participant, status: 'Attended' };
        }
        return participant;
      });
      setParticipants(updatedParticipants);
      setSelectedParticipants([]);
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const handleSelectAllChange = (e) => {
    setSelectedParticipants(
      e.target.checked ? participants.map((p) => p._id) : []
    );
  };

  const handleParticipantSelect = (participantId) => {
    const selectedIndex = selectedParticipants.indexOf(participantId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedParticipants, participantId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedParticipants.slice(1));
    } else if (selectedIndex === selectedParticipants.length - 1) {
      newSelected = newSelected.concat(selectedParticipants.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedParticipants.slice(0, selectedIndex),
        selectedParticipants.slice(selectedIndex + 1)
      );
    }
    setSelectedParticipants(newSelected);
  };

  const handleEventChange = (eventId) => {
    setSelectedEventId(eventId);
    fetchParticipants(eventId);
  };

  return (
    <>
      <div
        className="sidebar-overlay"
        onClick={toggleNav}
        style={{ display: isOpen ? 'block' : 'none' }}
      ></div>
      <div className="d-flex justify-content-around">
        {/* side nav bar beginning */}
        <div className="sidebar-header">
          <button className="sidebar-toggle" onClick={toggleNav}>
            {isOpen ? null : <FaBars />}
          </button>
        </div>
        <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
          <ul className={`sidebar-menu ${isOpen ? 'open' : ''}`}>
            <button className="sidebar-toggle" onClick={toggleNav}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
            <li>
              <img src={ksitmlogo} alt="Logo" className="logo" />
            </li>
            {scheduledEvents.map((event) => (
              <li key={event._id}>
                <button
                  className={`sidebar-item ${
                    selectedEventId === event._id ? 'active' : ''
                  }`}
                  onClick={() => handleEventChange(event._id)}
                >
                  {event.eventname}
                </button>
              </li>
            ))}
            <li>
              <button className="sidebar-item" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
        {/* side nav bar ending */}

        <div className="event-details-container">
          <div className="event-details-header">
            <h2 className="event-title">
              {scheduledEvents.find((event) => event._id === selectedEventId)?.eventname || 'Loading...'}
            </h2>
          </div>
          {noParticipantsFound ? (
            <p>No participants found for this event.</p>
          ) : (
            <div className="participants-list">
              <h3>Participants</h3>
              <div className="table-wrapper">
                <table className="participants-table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={
                            selectedParticipants.length === participants.length
                          }
                          onChange={handleSelectAllChange}
                        />
                      </th>
                      {scheduledEvents
                        .find((event) => event._id === selectedEventId)
                        ?.eventregistrationfields.map((field, index) => (
                          <th key={index}>{field.label}</th>
                        ))}
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant) => (
                      <tr key={participant._id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={
                              selectedParticipants.indexOf(participant._id) !== -1
                            }
                            onChange={() =>
                              handleParticipantSelect(participant._id)
                            }
                          />
                        </td>
                        {scheduledEvents
                          .find((event) => event._id === selectedEventId)
                          ?.eventregistrationfields.map((field, index) => (
                            <td key={index}>{participant[field.label]}</td>
                          ))}
                        <td>
                          <span
                            className={`status-pill ${
                              participant.status === 'Attended'
                                ? 'attended'
                                : 'registered'
                            }`}
                          >
                            {participant.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="controls-section">
            <div className="control-item">
              <h4>Mark Attendance</h4>
              <button
                className="preview-btn"
                onClick={() => handleMarkAttendance(selectedEventId)}
                disabled={selectedParticipants.length === 0}
              >
                Mark Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecurityDashboard;