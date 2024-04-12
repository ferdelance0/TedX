// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminRoutes from './pages/AdminRoutes';
import SecurityRoutes from './pages/SecurityRoutes';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/security/*" element={<SecurityRoutes />} />
      </Routes>
    </Router>
  );
};

export default App;
