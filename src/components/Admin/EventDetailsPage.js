// EventDetailsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../../styles/adminStyles.css";
import "../../styles/createEventPageStyles.css";
import "../../styles/eventDetailsPageStyles.css";

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

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
      console.log(eventId)
      await axios.get(`http://localhost:3000/masscertgen?eventId=${eventId}`)
      .then((response) => {
        console.log(response.data.certificate)
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
      console.log("Mass certificate generation request successfully!");
    } catch (error) {
      // Handle errors
      console.error("Error generating mass certificates:", error);
    }
  };
  

  if (!event) {
    return <div>Loading...</div>;
  }

  const handleSendBulkEmail = async () => {
    try {
      const subject = prompt("Enter the email subject:");
      const message = prompt("Enter the email message:");

      if (subject && message) {
        await axios.post(
          `http://localhost:3000/events/${eventId}/send-bulk-email`,
          {
            subject,
            message,
          }
        );
        alert("Bulk email sent successfully");
      }
    } catch (error) {
      console.error("Error sending bulk email:", error);
      alert("Failed to send bulk email");
    }
  };

  return (
    <div className="event-details-container">
      <div className="event-details-header">
        <h2 className="event-title">{event.eventname}</h2>
        {/* <div className="event-status-toggle">
          <span className="status upcoming">Upcoming</span>
          <span className="status completed">Completed</span>
        </div> */}
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
                <th>Download Certificate</th>
                <th>Download ID Card</th>
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
                        const { _id, Name } = participant; // Extract the required properties

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

                            // Create a new 'a' element
                            let a = document.createElement("a");
                            a.href = data.url; // Set the href to the URL from the response
                            a.download = "certificate.pdf"; // Set the download attribute to the desired file name
                            a.style.display = "none"; // Hide the element

                            document.body.appendChild(a); // Append the 'a' element to the body
                            a.click(); // Programmatically click the 'a' element to start the download

                            document.body.removeChild(a); // Remove the 'a' element from the body
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
                        const { _id, Name } = participant; // Extract the required properties

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

                            // Create a new 'a' element
                            let a = document.createElement("a");
                            a.href = data.url; // Set the href to the URL from the response
                            a.download = "idcard.pdf"; // Set the download attribute to the desired file name
                            a.style.display = "none"; // Hide the element

                            document.body.appendChild(a); // Append the 'a' element to the body
                            a.click(); // Programmatically click the 'a' element to start the download

                            document.body.removeChild(a); // Remove the 'a' element from the body
                          })
                          .catch((error) => {
                            console.error("Error:", error);
                          });
                      }}
                    >
                      Download ID Card
                    </button>
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
          <button
            className="preview-btn"
            onClick={() =>
              console.log("Mark attendance for:", selectedParticipants)
            }
          >
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
        {/* Add more control items */}
      </div>
    </div>
  );
};

export default EventDetailsPage;
