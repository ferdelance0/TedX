// EventDetailsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaDownload } from 'react-icons/fa';

import ksitmlogo from '../../images/logobanner.png';

import '../../styles/adminStyles.css';
import '../../styles/createEventPageStyles.css';
import '../../styles/eventDetailsPageStyles.css';
import '../../styles/sideNavbarStyles.css';

const EventDetailsPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    const fetchEventAndParticipants = async () => {
      try {
        // Fetch event details
        const eventResponse = await axios.get(
          `http://localhost:3000/events/${eventId}`
        );
        setEvent(eventResponse.data.event);

        // Fetch participants for the event
        const participantsResponse = await axios.get(
          `http://localhost:3000/events/${eventId}/participants`
        );
        setParticipants(participantsResponse.data);
      } catch (error) {
        console.error('Error fetching event and participants:', error);
      }
    };

    fetchEventAndParticipants();
  }, [eventId]);

  const handleSelectAllChange = (e) => {
    setSelectedParticipants(
      e.target.checked ? participants.map((p) => p._id) : []
    );
  };
  const toggleNav = () => {
    setIsOpen(!isOpen);
  };
  const handleBackToAdminDashboard = () => {
    navigate('/admin/dashboard');
  };
  const handleViewPollForm = () => {
    console.log('poll ques form');
    console.log(eventId);
    navigate(`/poll-question-form/${eventId}`);
  };
  const handleViewPollResponses = () => {
    navigate(`/admin/events/${eventId}/pollresponses`);
  };
  const toggleSubItems = (item) => {
    setActiveItem(activeItem === item ? null : item);
  };
  const handleMarkAttendance = async () => {
    try {
      await axios.post(
        `http://localhost:3000/events/${eventId}/mark-attendance`,
        {
          participantIds: selectedParticipants,
        }
      );
      // Update the local state to reflect the updated attendance status
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

  const handleMassGenerateCertificates = async () => {
    try {
      // Make a GET request with event ID in the request body
      console.log(eventId);
      await axios
        .get(`http://localhost:3000/masscertgen?eventId=${eventId}`)
        .then((response) => {
          console.log(response.data.certificate);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'certificates.csv');
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.error('Error downloading CSV file:', error);
        });
      // Handle success
      console.log('Mass certificate generation request successfully!');
    } catch (error) {
      // Handle errors
      console.error('Error generating mass certificates:', error);
    }
  };

  const handleSendBulkEmail = () => {
    console.log('Send Bulk Email button clicked');
    setShowBulkEmailModal(true);
  };

  const handleCloseBulkEmailModal = () => {
    setShowBulkEmailModal(false);
  };

  const handleSendEmail = async () => {
    try {
      await axios.post(
        `http://localhost:3000/events/${eventId}/send-bulk-email`,
        {
          subject: emailSubject,
          content: emailContent,
        }
      );
      alert('Bulk email sent successfully');
      handleCloseBulkEmailModal();
    } catch (error) {
      console.error('Error sending bulk email:', error);
      alert('Failed to send bulk email');
    }
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
                onClick={handleBackToAdminDashboard}
              >
                Back To Dashboard
              </button>
            </li>
            <li>
              <button
                className="send-bulk-email-btn sidebar-item"
                onClick={handleSendBulkEmail}
              >
                Send Bulk Email
              </button>
            </li>
            <li>
              <button
                className={`sidebar-item ${
                  activeItem === 'registration' ? 'active' : ''
                }`}
                onClick={() => toggleSubItems('registration')}
              >
                Registration
              </button>
              <ul
                className={`sub-menu ${
                  activeItem === 'registration' ? 'open' : ''
                }`}
              >
                <li>
                  <a
                    href={`http://localhost:3001/registration-form/${event._id}`}
                  >
                    <button className="sub-item">View Registration Form</button>
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <button
                className={`sidebar-item ${
                  activeItem === 'idCard' ? 'active' : ''
                }`}
                onClick={() => toggleSubItems('idCard')}
              >
                ID Card
              </button>
              <ul
                className={`sub-menu ${activeItem === 'idCard' ? 'open' : ''}`}
              >
                <li>
                  <button className="sub-item">View ID Card</button>
                </li>
                <li>
                  <button className="sub-item">
                    Send out ID cards to Registrants
                  </button>
                </li>
              </ul>
            </li>
            <li>
              <button
                className={`sidebar-item ${
                  activeItem === 'poll' ? 'active' : ''
                }`}
                onClick={() => toggleSubItems('poll')}
              >
                Poll
              </button>
              <ul className={`sub-menu ${activeItem === 'poll' ? 'open' : ''}`}>
                <li>
                  <button className="sub-item" onClick={handleViewPollForm}>
                    {' '}
                    View Poll Form
                  </button>
                </li>
                <li>
                  <button
                    className="sub-item"
                    onClick={handleViewPollResponses}
                  >
                    View Poll Responses
                  </button>
                </li>
              </ul>
            </li>
            <li>
              <button
                className={`sidebar-item ${
                  activeItem === 'certificate' ? 'active' : ''
                }`}
                onClick={() => toggleSubItems('certificate')}
              >
                Certificate
              </button>
              <ul
                className={`sub-menu ${
                  activeItem === 'certificate' ? 'open' : ''
                }`}
              >
                <li>
                  <button className="sub-item">View Certificate</button>
                </li>
                <li>
                  <button
                    className="sub-item"
                    onClick={handleMassGenerateCertificates}
                  >
                    Mass Generate Certificates
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        {/* side nav bar ending */}

        <div className="event-details-container">
          <div className="event-details-header">
            <h2 className="event-title">{event.eventname}</h2>
          </div>
          <div className="event-description">{event.eventdescription}</div>

          <div></div>
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
                    <th>Certificate</th>
                    <th>ID Card</th>
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
                        <button
                          className="download-btn"
                          onClick={() => {
                            const { _id, Name } = participant;

                            fetch('http://localhost:3000/generatecertificate', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                participantId: _id,
                                Name,
                                eventId,
                              }),
                            })
                              .then((response) => response.json())
                              .then((data) => {
                                console.log('Success:', data);

                                // Create a new 'a' element
                                let a = document.createElement('a');
                                a.href = data.url; // Set the href to the URL from the response
                                a.download = 'certificate.pdf'; // Set the download attribute to the desired file name
                                a.style.display = 'none'; // Hide the element

                                document.body.appendChild(a);
                                a.click();

                                document.body.removeChild(a);
                              })
                              .catch((error) => {
                                console.error('Error:', error);
                              });
                          }}
                        >
                          <FaDownload />
                        </button>
                      </td>
                      <td>
                        <button
                          className="download-btn"
                          onClick={() => {
                            const { _id, Name } = participant;

                            fetch('http://localhost:3000/generateID', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                participantId: _id,
                                Name,
                                eventId,
                              }),
                            })
                              .then((response) => response.json())
                              .then((data) => {
                                console.log('Success:', data);

                                let a = document.createElement('a');
                                a.href = data.url;
                                a.download = 'idcard.pdf';
                                a.style.display = 'none';

                                document.body.appendChild(a);
                                a.click();

                                document.body.removeChild(a);
                              })
                              .catch((error) => {
                                console.error('Error:', error);
                              });
                          }}
                        >
                          <FaDownload />
                        </button>
                      </td>
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
          <div className="controls-section">
            <div className="control-item">
              <h4>Mark Attendance</h4>
              <button className="preview-btn" onClick={handleMarkAttendance}>
                Mark Attendance
              </button>
            </div>
          </div>
          {showBulkEmailModal && (
            <div className="modal">
              <div className="modal-content">
                <h3>Send Bulk Email</h3>
                <input
                  type="text"
                  placeholder="Subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
                <textarea
                  placeholder="Email Content"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                ></textarea>
                <p>
                  Use the following markers for templating:
                  <br />
                  {`{{Name}}`}: Participant's name
                  <br />
                  {`{{Email}}`}: Participant's email
                </p>
                <div className="modal-buttons">
                  <button onClick={handleSendEmail}>Send</button>
                  <button onClick={handleCloseBulkEmailModal}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventDetailsPage;
