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

  const filteredEvents = events
    .map((event) => {
      const eventDate = new Date(event.eventscheduleddate);
      const currentDate = new Date();
      if (eventDate < currentDate) {
        return { ...event, status: "completed" };
      }
      return { ...event, status: "upcoming" };
    })
    .filter((event) => {
      const eventDate = new Date(event.eventscheduleddate);
      const eventYear = eventDate.getFullYear();
      const eventMonth = eventDate.getMonth();
      if (selectedYear !== eventYear) {
        return false;
      }
      if (selectedMonth !== "all" && selectedMonth !== eventMonth.toString()) {
        return false;
      }
      return true;
    });

  const handleCreateEvent = () => {
    navigate("/admin/create-event");
  };
  const handleViewEventDetails = (eventId) => {
    navigate(`/admin/view-eventdetails/${eventId}`);
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 5 },
    (_, index) => currentYear - index
  );

  // Generate month options
  const monthOptions = [
    { value: "all", label: "All" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

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
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {monthOptions.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="analytics-card-content">
              {
                filteredEvents.filter((event) => event.status === "upcoming")
                  .length
              }
            </div>
          </div>
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3>Completed Events</h3>
              <div className="analytics-card-filters">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {monthOptions.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="analytics-card-content">
              {
                filteredEvents.filter((event) => event.status === "completed")
                  .length
              }
            </div>
          </div>
        </div>
        <div className="event-table">
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Scheduled Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Registration Form</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event._id}>
                  <td>{event.eventname}</td>
                  <td>{event.eventscheduleddate}</td>
                  <td>{event.eventvenue}</td>
                  <td>{event.status}</td>
                  <td>
                    <a
                      href={`http://localhost:3001/admin/registration-form/${event._id}`}
                    >
                      Register
                    </a>
                  </td>
                  <td>
                    <button onClick={() => handleViewEventDetails(event._id)}>
                      View Details
                    </button>
                  </td>
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
