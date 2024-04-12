// RegistrationPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import mongoose from "mongoose";
import generateParticipantSchema from "./participantSchema";
import { useParams } from "react-router-dom";

const RegistrationPage = () => {
  const { eventId } = useParams();
  const [eventExists, setEventExists] = useState(false);
  const [registrationFields, setRegistrationFields] = useState([]);
  const [participantData, setParticipantData] = useState({});

  useEffect(() => {
    // Check if the event exists in the event table
    axios
      .get(`http://localhost:3000/events/${eventId}`)
      .then((response) => {
        if (response.event) {
          setEventExists(true);
          // Retrieve the participant schema for the event
          const participantSchema = generateParticipantSchema(
            response.data.event.registrationFields,
            eventId
          );
          const ParticipantModel = mongoose.model(
            `Participant_${eventId}`,
            participantSchema
          );
          setRegistrationFields(response.event.registrationFields);
          setParticipantData({ eventId });
        }
      })
      .catch((error) => {
        console.error("Error checking event existence:", error);
      });
  }, [eventId]);

  const handleInputChange = (field, value) => {
    setParticipantData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a new participant using the generated participant model
    const ParticipantModel = mongoose.model(
      `Participant_${eventId}`,
      generateParticipantSchema(registrationFields, eventId)
    );
    ParticipantModel.create(participantData)
      .then((createdParticipant) => {
        console.log("Participant registered:", createdParticipant);
        // Reset form data or redirect to a success page
      })
      .catch((error) => {
        console.error("Error registering participant:", error);
      });
  };

  if (!eventExists) {
    return <div>Event not found.</div>;
  }

  return (
    <div>
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        {registrationFields.map((field) => (
          <div key={field.label}>
            <label>{field.label}</label>
            <input
              type={field.inputType}
              value={participantData[field.label] || ""}
              onChange={(e) => handleInputChange(field.label, e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationPage;
