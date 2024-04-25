import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '../components/CommonComponents/LoginPage';
import PollQuestionForm from '../components/CommonComponents/PollQuestionsForm';
import RegistrationForm from '../components/CommonComponents/RegistrationForm';
import FeedbackForm from '../components/Admin/FeedbackForm';
const CommonRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/poll-question-form/:eventId/:participantId" element={<PollQuestionForm />} />
      <Route
        path="/registration-form/:eventId"
        element={<RegistrationForm />}
      />
       {/* <Route
        path="/events/:eventId/feedbackquestions"
        element={<FeedbackForm />}
      /> */}
    </Routes>
  );
};

export default CommonRoutes;
