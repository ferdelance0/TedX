// CreateEventPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/adminStyles.css";
import "../../styles/createEventPageStyles.css";
import ProgressBar from "./ProgressBar";
import axios from "axios";

const RegistrationFields = ({ fields, onFieldsChange, onPrevious, onNext }) => {
  const [registrationFields, setRegistrationFields] = useState(fields);
  const [customField, setCustomField] = useState("");

  useEffect(() => {
    onFieldsChange(registrationFields);
  }, [registrationFields, onFieldsChange]);

  const handleAddField = () => {
    if (customField.trim() !== "") {
      setRegistrationFields([
        ...registrationFields,
        { label: customField, checked: true },
      ]);
      setCustomField("");
    }
  };

  return (
    <>
      <div className="page-container">
        <h2 className="page-title">Registration</h2>
        <div className="form-group">
          <label>Fields to Collect</label>
          {registrationFields.map((field, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={field.checked}
                  onChange={(e) => {
                    const updatedFields = [...registrationFields];
                    updatedFields[index].checked = e.target.checked;
                    setRegistrationFields(updatedFields);
                  }}
                />
                {field.label}
              </label>
            </div>
          ))}
        </div>
        <div className="form-group">
          <label htmlFor="customField">Custom Field</label>
          <input
            type="text"
            id="customField"
            value={customField}
            onChange={(e) => setCustomField(e.target.value)}
          />
          <button
            type="button"
            className="content-button"
            onClick={handleAddField}
          >
            Add Field
          </button>
        </div>
        <div className="button-container">
          <button className="content-button" onClick={onPrevious}>
            Previous
          </button>
          <button className="content-button" onClick={onNext}>
            Save and Continue
          </button>
        </div>
      </div>
    </>
  );
};

const IdCardFields = ({
  registrationFields,
  idCardFields,
  onFieldsChange,
  onPrevious,
  onNext,
}) => {
  const handleFieldsChange = (selectedFields) => {
    onFieldsChange(selectedFields);
  };

  return (
    <>
      <h2>ID Card Generation</h2>
      <div className="form-group">
        <label>Select Fields for ID Card</label>
        {registrationFields
          .filter((field) => field.checked)
          .map((field, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={idCardFields.includes(field.label)}
                  onChange={(e) => {
                    const selectedFields = e.target.checked
                      ? [...idCardFields, field.label]
                      : idCardFields.filter((f) => f !== field.label);
                    handleFieldsChange(selectedFields);
                  }}
                />
                {field.label}
              </label>
            </div>
          ))}
      </div>
      <button className="content-button" onClick={onPrevious}>
        Previous
      </button>
      <button className="content-button" onClick={onNext}>
        Save and Continue
      </button>
    </>
  );
};

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const totalPages = 6;
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const [eventMode, setEventMode] = useState("");
  const [eventScheduledDate, setEventScheduledDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [multipleVenues, setMultipleVenues] = useState(false); // Add this line
  const [eventVenues, setEventVenues] = useState([
    {
      name: "",
      venue: "",
      state: "",
      date: "",
      time: "",
      duration: "",
      eventMode: "",
    },
  ]);
  const [registrationFields, setRegistrationFields] = useState([
    { label: "Name", checked: false },
    { label: "Phone", checked: false },
    { label: "Email", checked: false },
  ]);
  const [customField, setCustomField] = useState("");
  const [idCardFields, setIdCardFields] = useState([]);
  const [pollQuestions, setPollQuestions] = useState([
    { question: "", options: [""] },
  ]);
  const [feedbackEvent, setFeedbackEvent] = useState("");
  const [feedbackQuestions, setFeedbackQuestions] = useState([
    { question: "", inputType: "short" },
  ]);
  const [certificateEvent, setCertificateEvent] = useState("");
  const [certificateTemplate, setCertificateTemplate] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission and create the event
    const newEvent = {
      eventname: eventName,
      eventmode: eventMode,
      eventdescription: eventDescription,
      eventvenue: eventLocation,
      eventorganizer: "", // Add the organizer field if needed
      eventhassubevents: multipleVenues,
      eventfromdate: eventScheduledDate,
      eventtodate: eventScheduledDate, // Modify based on your requirements
    };
    //the posting details

    try {
      // Send a POST request to create the event
      const response = await axios.post(
        "http://localhost:3000/createevents",
        newEvent
      );
      const createdEvent = response.data;

      if (multipleVenues) {
        // Create subevents for multiple venues
        const subeventsData = eventVenues.map((venue) => ({
          subeventname: venue.name,
          subeventmode: venue.eventMode,
          subeventdescription: "",
          subeventvenue: venue.venue,
          subeventorganizer: "", // Add the organizer field if needed
          subeventfromdate: venue.date,
          subeventtodate: venue.date, // Modify based on your requirements
          subeventhassubsubevents: false,
          subeventparentevent: createdEvent._id,
        }));

        // Send a POST request to create the subevents
        await axios.post(
          "http://localhost:3000/createsubevents",
          subeventsData
        );
      }
    } catch (error) {
      console.error("Error creating event:", error);
      // Handle error scenario
    }
    // Reset form fields and state
    setPage(1);
    setEventName("");
    setEventDescription("");
    setEventDuration("");
    setEventScheduledDate("");
    setEventMode("");
    setEventLocation("");
    setEventVenues([
      { name: "", venue: "", state: "", date: "", time: "", duration: "" },
    ]);
    setRegistrationFields([
      { label: "Name", checked: false },
      { label: "Phone", checked: false },
      { label: "Email", checked: false },
    ]);
    setCustomField("");
    setIdCardFields([]);
    setPollQuestions([{ question: "", options: [""] }]);
    setFeedbackEvent("");
    setFeedbackQuestions([{ question: "", inputType: "short" }]);
    setCertificateEvent("");
    setCertificateTemplate(null);
    // Redirect back to the admin dashboard
    // navigate('/admin/dashboard');
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  const handlePrevious = () => {
    setPage(page - 1);
  };
  const handleBackToDashboard = () => {
    navigate("/admin/dashboard");
  };

  const handleRegistrationFieldsChange = (fields) => {
    setRegistrationFields(fields);
  };

  const handleIdCardFieldsChange = (fields) => {
    setIdCardFields(fields);
  };

  const renderPageOne = () => {
    const handleScheduledDateChange = (e) => {
      const selectedDate = new Date(e.target.value);
      const currentDate = new Date();
      if (selectedDate < currentDate) {
        alert("Start date cannot be prior to the current date");
        return;
      }
    };

    return (
      <>
        <div className="page-container">
          <h2 className="page-title">Event Details</h2>
          <div className="form-group">
            <label htmlFor="eventName">Name of the Event</label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventDescription">Description</label>
            <textarea
              id="eventDescription"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              required
            />
          </div>
          {!multipleVenues ? (
            <div className="form-group">
              <label htmlFor="eventMode">Event Mode</label>
              <select
                id="eventMode"
                value={eventMode}
                onChange={(e) => setEventMode(e.target.value)}
                required
              >
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
              </select>
            </div>
          ) : null}

          <div className="form-group">
            <label htmlFor="eventDuration">Duration</label>
            <input
              type="text"
              id="eventDuration"
              value={eventDuration}
              onChange={(e) => setEventDuration(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="eventScheduledDate">Scheduled Date</label>
            <input
              type="date"
              id="eventScheduledDate"
              value={eventScheduledDate}
              onChange={handleScheduledDateChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="eventLocation">Location</label>
            <input
              type="text"
              id="eventLocation"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              required
            />
          </div>

          {multipleVenues ? (
            <div className="form-group">
              <label>Venues</label>
              {eventVenues.map((venue, index) => (
                <div key={index}>
                  <input
                    type="text"
                    placeholder="Subevent Name"
                    value={venue.name}
                    onChange={(e) => {
                      const updatedVenues = [...eventVenues];
                      updatedVenues[index].name = e.target.value;
                      setEventVenues(updatedVenues);
                    }}
                    required
                  />
                  <select
                    value={venue.eventMode}
                    onChange={(e) => {
                      const updatedVenues = [...eventVenues];
                      updatedVenues[index].eventMode = e.target.value;
                      setEventVenues(updatedVenues);
                    }}
                    required
                  >
                    <option value="Offline" selected>
                      Offline
                    </option>
                    <option value="Online">Online</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Venue"
                    value={venue.venue}
                    onChange={(e) => {
                      const updatedVenues = [...eventVenues];
                      updatedVenues[index].venue = e.target.value;
                      setEventVenues(updatedVenues);
                    }}
                    required
                  />
                  {/* <input
                    type="text"
                    placeholder="State"
                    value={venue.state}
                    onChange={(e) => {
                      const updatedVenues = [...eventVenues];
                      updatedVenues[index].state = e.target.value;
                      setEventVenues(updatedVenues);
                    }}
                    required
                  /> */}

                  <input
                    type="date"
                    placeholder="Date"
                    value={venue.date}
                    onChange={(e) => {
                      const updatedVenues = [...eventVenues];
                      updatedVenues[index].date = e.target.value;
                      setEventVenues(updatedVenues);
                    }}
                    required
                  />
                  <input
                    type="time"
                    placeholder="Time"
                    value={venue.time}
                    onChange={(e) => {
                      const updatedVenues = [...eventVenues];
                      updatedVenues[index].time = e.target.value;
                      setEventVenues(updatedVenues);
                    }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={venue.duration}
                    onChange={(e) => {
                      const updatedVenues = [...eventVenues];
                      updatedVenues[index].duration = e.target.value;
                      setEventVenues(updatedVenues);
                    }}
                    required
                  />
                </div>
              ))}
              <button
                className="content-button"
                type="button"
                onClick={() =>
                  setEventVenues([
                    ...eventVenues,
                    {
                      name: "",
                      venue: "",
                      state: "",
                      date: "",
                      time: "",
                      duration: "",
                    },
                  ])
                }
              >
                Add New Venue
              </button>
            </div>
          ) : (
            <div className="form-group">
              <label>Venue</label>
              <input
                type="text"
                placeholder="Venue"
                value={eventVenues[0].venue}
                onChange={(e) => {
                  const updatedVenues = [...eventVenues];
                  updatedVenues[0].venue = e.target.value;
                  setEventVenues(updatedVenues);
                }}
                required
              />
              <div className="form-group">
                <label htmlFor="eventMode">Event Mode</label>
                <select
                  id="eventMode"
                  value={eventMode}
                  onChange={(e) => setEventMode(e.target.value)}
                  required
                >
                  <option value="Offline">Offline</option>
                  <option value="Online">Online</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="State"
                value={eventVenues[0].state}
                onChange={(e) => {
                  const updatedVenues = [...eventVenues];
                  updatedVenues[0].state = e.target.value;
                  setEventVenues(updatedVenues);
                }}
                required
              />
              <input
                type="date"
                placeholder="Date"
                value={eventVenues[0].date}
                onChange={(e) => {
                  const updatedVenues = [...eventVenues];
                  updatedVenues[0].date = e.target.value;
                  setEventVenues(updatedVenues);
                }}
                required
              />
              <input
                type="time"
                placeholder="Time"
                value={eventVenues[0].time}
                onChange={(e) => {
                  const updatedVenues = [...eventVenues];
                  updatedVenues[0].time = e.target.value;
                  setEventVenues(updatedVenues);
                }}
                required
              />
              <input
                type="text"
                placeholder="Duration"
                value={eventVenues[0].duration}
                onChange={(e) => {
                  const updatedVenues = [...eventVenues];
                  updatedVenues[0].duration = e.target.value;
                  setEventVenues(updatedVenues);
                }}
                required
              />
            </div>
          )}
          <div className="button-container">
            <button className="content-button" onClick={handleNext}>
              Save and Continue
            </button>
          </div>
        </div>
      </>
    );
  };

  const renderPageTwo = () => (
    <>
      <RegistrationFields
        fields={registrationFields}
        onFieldsChange={handleRegistrationFieldsChange}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </>
  );

  const renderPageThree = () => (
    <>
      <IdCardFields
        registrationFields={registrationFields}
        idCardFields={idCardFields}
        onFieldsChange={handleIdCardFieldsChange}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </>
  );

  const renderPageFour = () => (
    <>
      <div className="page-container">
        <h2 className="page-title">Poll</h2>
        {pollQuestions.map((question, index) => (
          <div key={index}>
            <div className="form-group">
              <label>Question {index + 1}</label>
              <input
                type="text"
                value={question.question}
                onChange={(e) => {
                  const updatedQuestions = [...pollQuestions];
                  updatedQuestions[index].question = e.target.value;
                  setPollQuestions(updatedQuestions);
                }}
                required
              />
            </div>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="form-group">
                <label>Option {optionIndex + 1}</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const updatedQuestions = [...pollQuestions];
                    updatedQuestions[index].options[optionIndex] =
                      e.target.value;
                    setPollQuestions(updatedQuestions);
                  }}
                  required
                />
              </div>
            ))}
            <button
              className="content-button "
              type="button"
              onClick={() => {
                const updatedQuestions = [...pollQuestions];
                updatedQuestions[index].options.push("");
                setPollQuestions(updatedQuestions);
              }}
            >
              Add Option
            </button>
          </div>
        ))}
        <button
          className="content-button "
          type="button"
          onClick={() =>
            setPollQuestions([
              ...pollQuestions,
              { question: "", options: [""] },
            ])
          }
        >
          Add Question
        </button>
        <div className="button-container">
          <button className="content-button " onClick={handlePrevious}>
            Previous
          </button>
          <button className="content-button " onClick={handleNext}>
            Save and Continue
          </button>
        </div>
      </div>
    </>
  );

  const renderPageFive = () => (
    <>
      <div className="page-container">
        <h2 className="page-title">Feedback Form</h2>
        <div className="form-group">
          <label htmlFor="feedbackEvent">Select Event</label>
          <select
            id="feedbackEvent"
            value={feedbackEvent}
            onChange={(e) => setFeedbackEvent(e.target.value)}
            required
          >
            {/* ... */}
          </select>
        </div>
        {feedbackQuestions.map((question, index) => (
          <div key={index}>
            <div className="form-group">
              <label>Question {index + 1}</label>
              <input
                type="text"
                value={question.question}
                onChange={(e) => {
                  const updatedQuestions = [...feedbackQuestions];
                  updatedQuestions[index].question = e.target.value;
                  setFeedbackQuestions(updatedQuestions);
                }}
                required
              />
            </div>
            <div className="form-group">
              <label>Input Type</label>
              <select
                value={question.inputType}
                onChange={(e) => {
                  const updatedQuestions = [...feedbackQuestions];
                  updatedQuestions[index].inputType = e.target.value;
                  setFeedbackQuestions(updatedQuestions);
                }}
                required
              >
                <option value="short">Short Text</option>
                <option value="multiple">Multiple Choice</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        ))}
        <button
          className="content-button "
          type="button"
          onClick={() =>
            setFeedbackQuestions([
              ...feedbackQuestions,
              { question: "", inputType: "short" },
            ])
          }
        >
          Add Question
        </button>
        <div className="button-container">
          <button className="content-button " onClick={handlePrevious}>
            Previous
          </button>
          <button className="content-button " onClick={handleNext}>
            Save and Continue
          </button>
        </div>
      </div>
    </>
  );

  const renderPageSix = () => (
    <>
      <div className="page-container">
        <h2 className="page-title">Certificate Generation</h2>
        <div className="form-group">
          <label htmlFor="certificateEvent">Select Event</label>
          <select
            id="certificateEvent"
            value={certificateEvent}
            onChange={(e) => setCertificateEvent(e.target.value)}
          >
            {/* ... */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="certificateTemplate">Upload Template</label>
          <input
            type="file"
            id="certificateTemplate"
            onChange={(e) => setCertificateTemplate(e.target.files[0])}
            required
          />
        </div>
        <div className="button-container">
          <button className="content-button " onClick={handlePrevious}>
            Previous
          </button>
          <button className="content-button " type="submit">
            Done
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="container">
      <div className="main-content">
        <h1 style={{ color: "black" }}>Create New Event</h1>

        {/* <button
          className="back-to-home-btn content-button"
          onClick={handleBackToDashboard}
        >
          Back To Dashboard
        </button> */}

        <ProgressBar currentPage={page} totalPages={totalPages} />
        <br></br>
        <form onSubmit={handleSubmit}>
          {page === 1 && renderPageOne()}
          {page === 2 && renderPageTwo()}
          {page === 3 && renderPageThree()}
          {page === 4 && renderPageFour()}
          {page === 5 && renderPageFive()}
          {page === 6 && renderPageSix()}
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
