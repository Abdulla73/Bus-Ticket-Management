// src/components/Auth/VerifyOTP.jsx
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/login.css'; 

const VerifyOTP = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('email'); 
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/verify-otp', {
        email,
        otp_code: otp,
      });
      alert(res.data.message);
      localStorage.removeItem('email'); // Clear email after verifying
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed. Try again.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="text-primary text-center">Verify Your Email <span role="img" aria-label="email">📧</span></h2>

        <p className="text-center mb-4">We have sent an OTP to your email: <b>{email}</b></p>

        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-success w-100 mb-3">Verify OTP</button>

        <p className="text-center">
          Already verified? <span className="link" onClick={() => navigate('/login')}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default VerifyOTP;
