// EventDetailsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaDownload } from "react-icons/fa";

import ksitmlogo from "../../images/logobanner.png";

import "../../styles/adminStyles.css";
import "../../styles/createEventPageStyles.css";
import "../../styles/eventDetailsPageStyles.css";
import "../../styles/sideNavbarStyles.css";
import Modal from "react-modal";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "500px",
    width: "100%",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};
Modal.setAppElement("#root");
const EventDetailsPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedSubevent, setSelectedSubevent] = useState("All");
  const [filteredParticipants, setFilteredParticipants] = useState([]);

  const [subevents, setSubevents] = useState([]);

useEffect(() => {
  const fetchEventAndParticipants = async () => {
    try {
      const eventResponse = await axios.get(
        `http://localhost:3000/events/${eventId}`
      );
      setEvent(eventResponse.data.event);
      console.log("Fetched event:", eventResponse.data.event);

      const participantsResponse = await axios.get(
        `http://localhost:3000/events/${eventId}/participants`
      );
      setParticipants(participantsResponse.data);
      console.log("Fetched participants:", participantsResponse.data);

      if (eventResponse.data.event.eventhassubevents) {
        const subeventsResponse = await axios.get(
          `http://localhost:3000/api/subevents/${eventId}`
        );
        setSubevents(subeventsResponse.data);
        console.log("Fetched subevents:", subeventsResponse.data);
      }
    } catch (error) {
      console.error(
        "Error fetching event, participants, and subevents:",
        error
      );
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
    navigate("/admin/dashboard");
  };

  const handleViewPollForm = () => {
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
      const updatedParticipants = participants.map((participant) => {
        if (selectedParticipants.includes(participant._id)) {
          return { ...participant, status: "Attended" };
        }
        return participant;
      });
      setParticipants(updatedParticipants);
      setSelectedParticipants([]);
    } catch (error) {
      console.error("Error marking attendance:", error);
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
      const response = await axios.get(
        `http://localhost:3000/masscertgen?eventId=${eventId}`
      );
      const certificates = response.data.certificateUrls;
      const csvContent =
        "Participant_ID,Name,Certificate_URL\n" +
        certificates
          .map(
            (cert) =>
              `${cert.Participant_ID},${cert.Name},${cert.Certificate_URL}`
          )
          .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "certificates.csv");
      document.body.appendChild(link);
      link.click();
      console.log("CSV file downloaded successfully!");
    } catch (error) {
      console.error("Error generating CSV file:", error);
    }
  };

  const handleSendBulkEmail = () => {
    setShowBulkEmailModal(true);
  };

  const handleCloseBulkEmailModal = () => {
    setShowBulkEmailModal(false);
  };

  const handleSendEmail = async () => {
    try {
      setIsSending(true);
      await axios.post(
        `http://localhost:3000/events/${eventId}/send-bulk-email`,
        {
          subject: emailSubject,
          content: emailContent.replace(/\n/g, "<br>"),
        }
      );
      setShowSuccessModal(true);
      handleCloseBulkEmailModal();
    } catch (error) {
      console.error("Error sending bulk email:", error);
      alert("Failed to send bulk email");
    } finally {
      setIsSending(false);
    }
  };
  const handleMassGenerateIDCards = async () => {
    try {
      await axios
        .get(`http://localhost:3000/massidcardgen?eventId=${eventId}`)
        .then((response) => {
          console.log(response.data);
          const certificates = response.data.idCardUrls;
          const csvContent =
            "Participant_ID,Name,Certificate_URL\n" +
            certificates
              .map(
                (cert) =>
                  `${cert.Participant_ID},${cert.Name},${cert.idCardUrl}`
              )
              .join("\n");
          const blob = new Blob([csvContent], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "certificates.csv");
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.error("Error downloading CSV file:", error);
        });
      console.log("Mass ID card generation request successful!");
    } catch (error) {
      console.error("Error generating mass ID cards:", error);
    }
  };

  const handleSubeventFilter = (subeventId) => {
    setSelectedSubevent(subeventId);
  };

  useEffect(() => {
    const filterParticipants = () => {
      console.log("Filtering participants...");
      console.log("Selected subevent:", selectedSubevent);
      console.log("Event:", event);
      console.log("Participants:", participants);
      
      const filtered = participants.filter((participant) => {
        if (selectedSubevent === "All" || !event || !event.eventhassubevents) {
       
          console.log(`Participant ${participant.Name} included (All or no subevents)`);
          return true;
        } else {
          const isIncluded = participant.subevents.some((subevent) => subevent.subeventName=== selectedSubevent);
          console.log("participant subevents in the else",participant.subevents);
          if (isIncluded) {
            console.log(`Participant ${participant.Name} included (Registered for subevent ${selectedSubevent})`);
          } else {
            console.log(`Participant ${participant.Name} excluded (Not registered for subevent ${selectedSubevent})`);
          }
          return isIncluded;
        }
      });
  
      console.log("Filtered participants:", filtered);
      setFilteredParticipants(filtered);
    };
  
    filterParticipants();
  }, [selectedSubevent, participants, event]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div
        className="sidebar-overlay"
        onClick={toggleNav}
        style={{ display: isOpen ? "block" : "none" }}
      ></div>
      <div className="d-flex justify-content-around">
        {/* side nav bar beginning */}
        <div className="sidebar-header">
          <button className="sidebar-toggle" onClick={toggleNav}>
            {isOpen ? null : <FaBars />}
          </button>
        </div>
        <nav className={`sidebar ${isOpen ? "open" : ""}`}>
          <ul className={`sidebar-menu ${isOpen ? "open" : ""}`}>
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
                  activeItem === "registration" ? "active" : ""
                }`}
                onClick={() => toggleSubItems("registration")}
              >
                Registration
              </button>
              <ul
                className={`sub-menu ${
                  activeItem === "registration" ? "open" : ""
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
                  activeItem === "idCard" ? "active" : ""
                }`}
                onClick={() => toggleSubItems("idCard")}
              >
                ID Card
              </button>
              <ul
                className={`sub-menu ${activeItem === "idCard" ? "open" : ""}`}
              >
                <li>
                  <button className="sub-item">View ID Card</button>
                </li>
                <li>
                  <button
                    className="sub-item"
                    onClick={handleMassGenerateIDCards}
                  >
                    Mass Generate ID Cards
                  </button>
                </li>
              </ul>
            </li>
            <li>
              <button
                className={`sidebar-item ${
                  activeItem === "poll" ? "active" : ""
                }`}
                onClick={() => toggleSubItems("poll")}
              >
                Poll
              </button>
              <ul className={`sub-menu ${activeItem === "poll" ? "open" : ""}`}>
                <li>
                  <button className="sub-item" onClick={handleViewPollForm}>
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
                  activeItem === "certificate" ? "active" : ""
                }`}
                onClick={() => toggleSubItems("certificate")}
              >
                Certificate
              </button>
              <ul
                className={`sub-menu ${
                  activeItem === "certificate" ? "open" : ""
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
          <div className="participants-list">
            <h3>Participants</h3>
            {event.eventhassubevents && subevents.length > 0 && (
              <div className="subevent-filter">
                <button
                  className={`subevent-filter-btn ${
                    selectedSubevent === "All" ? "active" : ""
                  }`}
                  onClick={() => handleSubeventFilter("All")}
                >
                  
                  All
                </button>
                {subevents.map((subevent) => (
                  <button
                    key={subevent._id}
                    className={`subevent-filter-btn ${
                      selectedSubevent === subevent.subeventname
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleSubeventFilter(subevent.subeventname)}
                  >
                    {subevent.subeventname}
                  </button>
                ))}
              </div>
            )}
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
                    {event.eventhassubevents && <th>Subevents Registered</th>}
                    <th>Certificate</th>
                    <th>ID Card</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((participant) => (
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
                      {event.eventhassubevents && (
                         <td>
                         {participant.subevents.map((subevent) => {
                           console.log("Subevent:", subevent);
                           console.log("Subevent ID:", subevent.subeventId);
                           return (
                             <span key={subevent.subeventId._id || subevent._id}>
                               {subevent.subeventName || "bleeeee"}
                               {participant.subevents.length > 1 && ", "}
                             </span>
                           );
                         })}
                       </td>
                      )}
                      <td>
                        <button
                          className="download-btn"
                          onClick={() => {
                            const { _id, Name } = participant;
                            fetch("http://localhost:3000/generatecertificate", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                participantId: _id,
                                Name,
                                eventId,
                              }),
                            })
                              .then((response) => response.json())
                              .then((data) => {
                                let a = document.createElement("a");
                                a.href = data.url;
                                a.download = "certificate.pdf";
                                a.style.display = "none";

                                document.body.appendChild(a);
                                a.click();

                                document.body.removeChild(a);
                              })
                              .catch((error) => {
                                console.error("Error:", error);
                              });
                          }}
                        >
                          <FaDownload />
                        </button>
                      </td>{" "}
                      <td>
                        <button
                          className="download-btn"
                          onClick={() => {
                            const { _id, Name } = participant;

                            fetch("http://localhost:3000/generateID", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                participantId: _id,
                                Name,
                                eventId,
                              }),
                            })
                              .then((response) => response.json())
                              .then((data) => {
                                let a = document.createElement("a");
                                a.href = data.url;
                                a.download = "idcard.pdf";
                                a.style.display = "none";

                                document.body.appendChild(a);
                                a.click();

                                document.body.removeChild(a);
                              })
                              .catch((error) => {
                                console.error("Error:", error);
                              });
                          }}
                        >
                          <FaDownload />
                        </button>
                      </td>
                      <td>
                        <span
                          className={`status-pill ${
                            participant.status === "Attended"
                              ? "attended"
                              : "registered"
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
          </div>{" "}
          <Modal
            isOpen={showBulkEmailModal}
            onRequestClose={handleCloseBulkEmailModal}
            style={customModalStyles}
            contentLabel="Bulk Email Modal"
          >
            <h3>Send Bulk Email</h3>
            <input
              type="text"
              placeholder="Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="modal-input"
              disabled={isSending}
            />
            <textarea
              placeholder="Email Content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="modal-textarea"
              disabled={isSending}
            ></textarea>
            <p>
              Use the following markers for templating:
              <br />
              {`{{Name}}`}: Participant's name
              <br />
              {`{{Email}}`}: Participant's email
              <br />
              {`{{Certificate_URL}}`}: Participant's certificate URL
              <br />
              {`{{Status}}`}: Participant's attendance status
            </p>
            <div className="modal-buttons">
              <button
                onClick={handleSendEmail}
                className="modal-send-button"
                disabled={isSending}
              >
                {isSending ? <FaSpinner className="spinning" /> : "Send"}
              </button>
              <button
                onClick={handleCloseBulkEmailModal}
                className="modal-cancel-button"
                disabled={isSending}
              >
                Cancel
              </button>
            </div>
          </Modal>
          {showSuccessModal && (
            <Modal
              isOpen={showSuccessModal}
              onRequestClose={() => setShowSuccessModal(false)}
              style={customModalStyles}
              contentLabel="Success Modal"
            >
              <div className="success-modal-content">
                <h3>
                  <FaCheckCircle className="success-icon" /> Bulk Email Sent
                  Successfully
                </h3>
                <p>Your bulk email has been sent to all participants.</p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="modal-close-button"
                >
                  Close
                </button>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </>
  );
};
export default EventDetailsPage;
