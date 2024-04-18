// EventDetailsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../../styles/adminStyles.css";
import "../../styles/createEventPageStyles.css";
import "../../styles/eventDetailsPageStyles.css";
import Modal from "react-modal";
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
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");

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
        console.error("Error fetching event and participants:", error);
      }
    };

    fetchEventAndParticipants();
  }, [eventId]);

  const handleSelectAllChange = (e) => {
    setSelectedParticipants(
      e.target.checked ? participants.map((p) => p._id) : []
    );
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
      // Make a GET request with event ID in the request body
      console.log(eventId);
      await axios
        .get(`http://localhost:3000/masscertgen?eventId=${eventId}`)
        .then((response) => {
          console.log(response.data.certificate);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "certificates.csv");
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.error("Error downloading CSV file:", error);
        });
      // Handle success
      console.log("Mass certificate generation request successfully!");
    } catch (error) {
      // Handle errors
      console.error("Error generating mass certificates:", error);
    }
  };

  const handleSendBulkEmail = () => {
    console.log(showBulkEmailModal);
    console.log("handlesendbulkmail fired");
    setShowBulkEmailModal(true);
    console.log(showBulkEmailModal);
  };

  const handleCloseBulkEmailModal = () => {
    console.log("close modal thingie fired");
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
      alert("Bulk email sent successfully");
      handleCloseBulkEmailModal();
    } catch (error) {
      console.error("Error sending bulk email:", error);
      alert("Failed to send bulk email");
    }
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="event-details-container">
      <div className="event-details-header">
        <h2 className="event-title">{event.eventname}</h2>
      </div>
      <div className="event-description">{event.eventdescription}</div>
      <div>
        <Link to={`/admin/poll-question-form/${eventId}`}>
          <button className="content-button">Poll Form</button>
        </Link>
        <Link to={`/admin/events/${eventId}/pollresponses`}>
          <button className="content-button">View Poll Responses</button>
        </Link>
        <button className="send-bulk-email-btn" onClick={handleSendBulkEmail}>
          Send Bulk Email
        </button>
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
                      onChange={() => handleParticipantSelect(participant._id)}
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
                            console.log("Success:", data);

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
                      Download Certificate
                    </button>
                  </td>
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
                            console.log("Success:", data);

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
                      Download ID Card
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
        <div className="control-item">
          <h4>Mass Generate Certificates</h4>
          <button
            className="preview-btn"
            onClick={handleMassGenerateCertificates}
          >
            Mass Generate Certificates
          </button>
        </div>
      </div>

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
        />
        <textarea
          placeholder="Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          className="modal-textarea"
        ></textarea>
        <p>
          Use the following markers for templating:
          <br />
          {`{{Name}}`}: Participant's name
          <br />
          {`{{Email}}`}: Participant's email
        </p>
        <div className="modal-buttons">
          <button onClick={handleSendEmail} className="modal-send-button">
            Send
          </button>
          <button
            onClick={handleCloseBulkEmailModal}
            className="modal-cancel-button"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EventDetailsPage;
