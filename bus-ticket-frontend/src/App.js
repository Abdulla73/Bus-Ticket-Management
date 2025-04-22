// src/App.jsx
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from './components/Admin/AdminDashboard'; // Import Admin Dashboard (you can create this)
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import VerifyOTP from './components/Auth/VerifyOTP';
import UserDashboard from './components/User/UserDashboard';

function App() {
  const userRole = localStorage.getItem('role'); // Assuming role is stored in localStorage

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        
        {/* Check if the user is logged in and redirect to proper dashboard */}
        <Route
          path="/dashboard"
          element={
            userRole === 'admin' ? <AdminDashboard /> : 
            userRole === 'user' ? <UserDashboard /> : 
            <Navigate to="/login" />
          }
        />
        
        {/* You can add more dashboards here */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
