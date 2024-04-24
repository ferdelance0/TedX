import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBars, FaTimes, FaCheckCircle } from 'react-icons/fa';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { getToken, getEventId, removeToken} from '../../auth/auth';
import ksitmlogo from '../../images/logobanner.png';

import '../../styles/adminStyles.css';
import '../../styles/sideNavbarStyles.css';

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

const SecurityDashboard = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchEventAndParticipants = async () => {
      try {
        const token = getToken();
        const eventId = getEventId(token);

        const eventResponse = await axios.get(
          `http://localhost:3000/events/${eventId}`
        );
        setEvent(eventResponse.data.event);

        const participantsResponse = await axios.get(
          `http://localhost:3000/events/${eventId}/participants`
        );
        setParticipants(participantsResponse.data);
      } catch (error) {
        console.error('Error fetching event and participants:', error);
      }
    };

    fetchEventAndParticipants();
  }, []);

  const toggleNav = () => {
    setIsOpen(!isOpen);
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

  const handleMarkAttendance = async () => {
    try {
      const token = getToken();
      const eventId = getEventId(token);

      await axios.post(
        `http://localhost:3000/events/${eventId}/mark-attendance`,
        {
          participantIds: selectedParticipants,
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

  const handleBackToLogin = () => {
    removeToken()
    navigate('/login');
  };

  if (!event) {
    return <div>Loading...</div>;
  }

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
            <li>
              <button
                className="sidebar-item"
                onClick={handleBackToLogin}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
        {/* side nav bar ending */}

        <div className="event-details-container">
          <div className="event-details-header">
            <h2 className="event-title">{event.eventname}</h2>
          </div>
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
                    {event.eventregistrationfields.map((field, index) => (
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
                      {event.eventregistrationfields.map((field, index) => (
                        <td key={index}>{participant[field.label]}</td>
                      ))}
                      <td>
                        <span
                          className={`status-pill ${participant.status === 'Attended'
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

          <div className="controls-section">
            <div className="control-item">
              <h4>Mark Attendance</h4>
              <button className="preview-btn" onClick={handleMarkAttendance}>
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