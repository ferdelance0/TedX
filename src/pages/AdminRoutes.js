import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from '../components/Admin/AdminDashboard';
import EventDetails from '../components/Admin/EventDetails';
// import RegistrationForm from '../components/Admin/RegistrationForm';
// import IdCardGenerator from '../components/Admin/IdCardGenerator';
// import FeedbackForm from '../components/Admin/FeedbackForm';
// import Poll from '../components/Admin/Poll';
// import Certificate from '../components/Admin/Certificate';
import LoginPage from '../components/Admin/LoginPage';
import CreateEventPage from '../components/Admin/CreateEventPage';

const AdminRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/event-details" element={<EventDetails />} />
        <Route path="/admin/create-event" element={<CreateEventPage />} />
        {/* Add more routes for other admin components */}
      </Routes>
    </Router>
  );
};

export default AdminRoutes;
