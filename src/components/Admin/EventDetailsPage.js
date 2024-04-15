// EventDetailsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="event-details-container">
      <div className="event-details-header">
        <h2 className="event-title">{event.eventname}</h2>
        <div className="event-status-toggle">
          <span className="status upcoming">Upcoming</span>
          <span className="status completed">Completed</span>
        </div>
      </div>
      <div className="event-description">{event.eventdescription}</div>
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
        {/* Add more control items */}
      </div>
    </div>
  );
};

export default EventDetailsPage;
