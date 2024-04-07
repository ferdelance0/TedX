// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminRoutes from './pages/AdminRoutes';
import SecurityRoutes from './pages/SecurityRoutes';
// import ParticipantRoutes from './pages/ParticipantRoutes';
import CommonRoutes from './pages/CommonRoutes';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/security/*" element={<SecurityRoutes />} />
        <Route path="/*" element={<CommonRoutes />} />
      </Routes>
    </Router>
  );
};

export default App;
