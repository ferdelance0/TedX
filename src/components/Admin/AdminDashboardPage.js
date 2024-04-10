import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/adminStyles.css";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3000/events");
      if (response.ok) {
        console.log("fetch success");
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const updatedEvents = events.map((event) => {
      if (new Date(event.endDate) < currentDate) {
        return { ...event, status: "completed" };
      }
      return event;
    });
    setEvents(updatedEvents);
  }, []);

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.startDate);
    const eventYear = eventDate.getFullYear();
    const eventMonth = eventDate.getMonth();
    if (selectedYear !== eventYear) {
      return false;
    }
    if (selectedMonth !== "all" && selectedMonth !== eventMonth) {
      return false;
    }
    return true;
  });

  const handleCreateEvent = () => {
    navigate("/admin/create-event");
  };
  const handleViewEventDetails = () => {
    navigate("/admin/view-eventdetails");
  };

  const upcomingEventsCount = filteredEvents.filter(
    (event) => event.status === "upcoming"
  ).length;
  const completedEventsCount = filteredEvents.filter(
    (event) => event.status === "completed"
  ).length;
  const totalParticipantsCount = filteredEvents.reduce(
    (total, event) => total + event.registrationFields.length,
    0
  );

  return (
    <div className="main-container">
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
        </div>
        <div className="event-table">
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Scheduled Date</th>
                <th>Location</th>
                <th>Chief Guest</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>{event.eventname}</td>
                  <td>{event.scheduledDate}</td>
                  <td>{event.eventvenue}</td>
                  <td>{event.chiefGuest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboardPage;
