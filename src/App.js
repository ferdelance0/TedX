// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getToken } from './auth/auth';// Import functions to manage authentication

// Import your route components
import AdminRoutes from './pages/AdminRoutes';
import SecurityRoutes from './pages/SecurityRoutes';
import CommonRoutes from './pages/CommonRoutes';
import LoginPage from './components/CommonComponents/LoginPage';

// Define a higher-order component (HOC) for protecting routes
const ProtectedRoute = ({ element, ...rest }) => {
  const isAuthenticated = getToken();
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Protect all admin routes */}
        <Route path="/admin/*" element={<ProtectedRoute element={<AdminRoutes />} />}/>
        <Route path="/security/*" element={<ProtectedRoute element={<SecurityRoutes />} />}/> 
        <Route path="/*" element={<ProtectedRoute element={<CommonRoutes />} />}/>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
