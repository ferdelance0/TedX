// pages/AdminRoutes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminDashboardPage from '../components/Admin/AdminDashboardPage';
import EventDetails from '../components/Admin/EventDetailsPage';
import CreateEventPage from '../components/Admin/CreateEventPage';
import RegistrationForm from '../components/Admin/RegistrationForm';
// import IdCardGenerator from '../components/Admin/IdCardGenerator';
// import FeedbackForm from '../components/Admin/FeedbackForm';
// import Poll from '../components/Admin/Poll';
// import Certificate from '../components/Admin/Certificate';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboardPage />} />
      <Route path="/view-eventdetails" element={<EventDetails />} />
      <Route path="/create-event" element={<CreateEventPage />} />
      <Route path="/registration-form" element={<RegistrationForm />} />
      {/*<Route path="/admin/id-card-generator" element={<IdCardGenerator />} />
      <Route path="/admin/feedback-form" element={<FeedbackForm />} />
      <Route path="/admin/poll" element={<Poll />} /> */}
      {/* <Route path="/admin/certificate" element={<Certificate />} /> */}
      {/* <Route path="/admin/login" element={<LoginPage />} /> */}
    </Routes>
  );
};

export default AdminRoutes;
