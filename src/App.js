// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminRoutes from './pages/AdminRoutes';
import SecurityRoutes from './pages/SecurityRoutes';
import LoginPage from './components/CommomComponents/LoginPage'
import SignUpPage from './components/CommomComponents/SignupPage'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/security/*" element={<SecurityRoutes />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
      </Routes>
    </Router>
  );
};

export default App;
