import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  useEffect(() => {
    console.log('Event ID:', eventId);
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/events/${eventId}`);
        console.log('Fetched event:', res.data.event); // Added console.log
        setEvent(res.data.event);
      } catch (error) {
        console.error('Error fetching event:', error); // Added console.error
      }
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    console.log('Event ID:', eventId);
    const fetchParticipants = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/events/${eventId}/participants`
        );
        console.log('Fetched participants:', res.data); // Added console.log
        setParticipants(res.data);
      } catch (error) {
        console.error('Error fetching participants:', error); // Added console.error
      }
    };
    fetchParticipants();
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
    <div>
      <h2>Event Details</h2>
      <p>
        <strong>Title:</strong> {event.eventname}
      </p>
      <p>
        <strong>Description:</strong> {event.eventdescription}
      </p>
      <p>
        <strong>Organizer:</strong> {event.eventorganizer}
      </p>
      {/* Render other event fields */}
      <div>
        <Link to={`/admin/poll-question-form/${eventId}`}>
          <button>Go to Poll Form</button>
        </Link>
        <Link to={`/admin/events/${eventId}/pollresponses`}>
          <button>View Poll Responses</button>
        </Link>
        {/* Add more action buttons */}
      </div>
      <h2>Participants</h2>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedParticipants.length === participants.length}
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
                  checked={selectedParticipants.indexOf(participant._id) !== -1}
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

      <button
        onClick={() =>
          console.log('Mark attendance for:', selectedParticipants)
        }
      >
        Mark Attendance
      </button>
      {/* Add more action buttons */}
    </div>
  );
};

export default EventDetailsPage;
