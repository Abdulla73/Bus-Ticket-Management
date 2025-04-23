
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from './components/Admin/AdminDashboard';
import Ticket from './components/Admin/Ticket';
import UpdateBus from './components/Admin/UpdateBus';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import VerifyOTP from './components/Auth/VerifyOTP';
import BuyTicket from './components/User/BuyTicket';
import UserDashboard from './components/User/UserDashboard';

function App() {
  const userRole = localStorage.getItem('role'); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/add-ticket" element={<Ticket />} />
        <Route path="/admin/update-bus/:id" element={<UpdateBus />} /> 
        <Route path="/dashboard" element={userRole === 'admin' ? <AdminDashboard /> : userRole === 'user' ? <UserDashboard /> : <Navigate to="/login" />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/buy-ticket" element={<BuyTicket />} />
      </Routes>
    </Router>
  );
}

export default App;
