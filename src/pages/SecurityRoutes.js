// pages/AdminRoutes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SecurityDashboard from '../components/Security/SecurityDashboard'
const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<SecurityDashboard />} />
        </Routes>
    );
};

export default AdminRoutes;
