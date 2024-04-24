// pages/AdminRoutes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminDashboardPage from '../components/Admin/AdminDashboardPage';
import CreateEventPage from '../components/Admin/CreateEventPage';
import EventDetailsPage from '../components/Admin/EventDetailsPage';
import AddVolunteer from '../components/Admin/AddVolunteer'
// import IdCardGenerator from '../components/Admin/IdCardGenerator';
import FeedbackForm from '../components/Admin/FeedbackForm';
import SignUpPage from '../components/Admin/SignupPage';
import PollResponsesPage from '../components/Admin/PollResponsesPage';
// import Certificate from '../components/Admin/Certificate';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<AdminDashboardPage />} />

      <Route path="/create-event" element={<CreateEventPage />} />

      <Route path="/events/:eventId/details" element={<EventDetailsPage />} />
      <Route path="/add-volunteer" element={<AddVolunteer />} />

      <Route
        path="/events/:eventId/pollresponses"
        element={<PollResponsesPage />}
      />
      <Route
        path="/events/:eventId/feedbackquestions"
        element={<FeedbackForm />}
      />
      {/*<Route path="/admin/id-card-generator" element={<IdCardGenerator />} />
      <Route path="/admin/feedback-form" element={<FeedbackForm />} />
      <Route path="/admin/poll" element={<Poll />} /> */}
      {/* <Route path="/admin/certificate" element={<Certificate />} /> */}
      {/* <Route path="/admin/login" element={<LoginPage />} /> */}
    </Routes>
  );
};

export default AdminRoutes;
