import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/adminStyles.css';
import '../../styles/modalStyles.css';
const RegistrationFields = ({ fields, onFieldsChange, onPrevious, onNext }) => {
  const [registrationFields, setRegistrationFields] = useState(fields);
  const [customField, setCustomField] = useState('');

  useEffect(() => {
    onFieldsChange(registrationFields);
  }, [registrationFields, onFieldsChange]);

  const handleAddField = () => {
    setRegistrationFields([...registrationFields, customField]);
    setCustomField('');
  };

  return (
    <>
      <h2>Registration</h2>
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
          className="modal-content-button "
          onClick={handleAddField}
        >
          Add Field
        </button>
      </div>
      <button className="modal-content-button " onClick={onPrevious}>
        Previous
      </button>
      <button className="modal-content-button " onClick={onNext}>
        Save and Continue
      </button>
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
      <div className="id-card-preview">
        {/* Render ID card preview with selected fields */}
      </div>
      <button className="modal-content-button " onClick={onPrevious}>
        Previous
      </button>
      <button className="modal-content-button " onClick={onNext}>
        Save and Continue
      </button>
    </>
  );
};
const EventModal = ({ isOpen, onClose, onSubmit }) => {
  const [page, setPage] = useState(1);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventDuration, setEventDuration] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventVenues, setEventVenues] = useState([
    { name: '', venue: '', state: '', date: '', time: '', duration: '' },
  ]);
  const [registrationFields, setRegistrationFields] = useState([
    { label: 'Name', checked: false },
    { label: 'Phone', checked: false },
    { label: 'Email', checked: false },
  ]);
  const [customField, setCustomField] = useState('');
  const [idCardFields, setIdCardFields] = useState([]);
  const [pollQuestions, setPollQuestions] = useState([
    { question: '', options: [''] },
  ]);
  const [feedbackEvent, setFeedbackEvent] = useState('');
  const [feedbackQuestions, setFeedbackQuestions] = useState([
    { question: '', inputType: 'short' },
  ]);
  const [certificateEvent, setCertificateEvent] = useState('');
  const [certificateTemplate, setCertificateTemplate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      // ... other form data ...
      eventName,
      eventDescription,
      eventStartDate,
      eventEndDate,
      eventLocation,
      registrationFields: registrationFields.filter((field) => field.checked),
      idCardFields,
    });
    // Reset form fields and state
    setPage(1);
    setEventName('');
    setEventDescription('');
    setEventStartTime('');
    setEventDuration('');
    setEventStartDate('');
    setEventEndDate('');
    setEventLocation('');
    setEventVenues([
      { name: '', venue: '', state: '', date: '', time: '', duration: '' },
    ]);
    setRegistrationFields([
      { label: 'Name', checked: false },
      { label: 'Phone', checked: false },
      { label: 'Email', checked: false },
    ]);
    setCustomField('');
    setIdCardFields([]);
    setPollQuestions([{ question: '', options: [''] }]);
    setFeedbackEvent('');
    setFeedbackQuestions([{ question: '', inputType: 'short' }]);
    setCertificateEvent('');
    setCertificateTemplate(null);
    onClose();
  };

  const handleCloseModal = () => {
    // Reset form fields and state
    setPage(1);
    onClose();
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  const handlePrevious = () => {
    setPage(page - 1);
  };
  const handleRegistrationFieldsChange = (fields) => {
    setRegistrationFields(fields);
  };

  const handleIdCardFieldsChange = (fields) => {
    setIdCardFields(fields);
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

  const renderPageSix = () => (
    <>
      <h2>Certificate Generation</h2>
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
      <button className="modal-content-button " onClick={handlePrevious}>
        Previous
      </button>
      <button className="modal-content-button " type="submit">
        Done
      </button>
    </>
  );

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Event</h2>
          <button className="close-button" onClick={handleCloseModal}>
            &times;
          </button>
        </div>
        <div className="progress-bar">{/* Render progress bar */}</div>
        <form onSubmit={handleSubmit}>
          {page === 2 && renderPageTwo()}
          {page === 3 && renderPageThree()}

          {page === 6 && renderPageSix()}
        </form>
      </div>
    </div>
  );
};
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [events, setEvents] = useState([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const updatedEvents = events.map((event) => {
      if (new Date(event.endDate) < currentDate) {
        return { ...event, status: 'completed' };
      }
      return event;
    });
    setEvents(updatedEvents);
  }, [events]);

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.startDate);
    const eventYear = eventDate.getFullYear();
    const eventMonth = eventDate.getMonth();
    if (selectedYear !== eventYear) {
      return false;
    }
    if (selectedMonth !== 'all' && selectedMonth !== eventMonth) {
      return false;
    }
    return true;
  });

  const handleCreateEvent = () => {
    navigate('/admin/create-event');
  };

  const upcomingEventsCount = filteredEvents.filter(
    (event) => event.status === 'upcoming'
  ).length;
  const completedEventsCount = filteredEvents.filter(
    (event) => event.status === 'completed'
  ).length;
  const totalParticipantsCount = filteredEvents.reduce(
    (total, event) => total + event.registrationFields.length,
    0
  );

  return (
    <div className="container">
      <div className="sidebar">
        <button
          className="create-event-btn"
          onClick={() => handleCreateEvent()}
        >
          Create Event
        </button>
        <button className="create-event-btn">View Upcoming Events</button>
        <button className="create-event-btn">View Completed Events</button>
        <button className="create-event-btn">Log Out</button>
      </div>
      <div className="main-content">
        <h1>Admin Dashboard</h1>
        <div className="analytics-section">
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3>Upcoming Events</h3>
              <div className="analytics-card-filters">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {/* Render year options */}
                </select>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="all">All</option>
                  {/* Render month options */}
                </select>
              </div>
            </div>
            <div className="analytics-card-content">{upcomingEventsCount}</div>
          </div>
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3>Completed Events</h3>
              <div className="analytics-card-filters">
                {/* Render year and month dropdowns */}
              </div>
            </div>
            <div className="analytics-card-content">{completedEventsCount}</div>
          </div>
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3>Total Participants</h3>
              <div className="analytics-card-filters">
                {/* Render year and month dropdowns */}
              </div>
            </div>
            <div className="analytics-card-content">
              {totalParticipantsCount}
            </div>
          </div>
        </div>
        {/* ... existing code ... */}
        <div className="event-table">
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Location</th>
                <th>Chief Guest</th>
                <th>Registered Fields</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.startDate}</td>
                  <td>{event.endDate}</td>
                  <td>{event.location}</td>
                  <td>{event.chiefGuest}</td>
                  <td>{event.registrationFields.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
