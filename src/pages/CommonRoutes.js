import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '../components/CommomComponents/LoginPage';

const CommonRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default CommonRoutes;
