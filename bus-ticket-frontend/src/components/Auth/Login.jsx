import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post('http://localhost:8000/api/login', formData);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('role', res.data.role); 
          localStorage.setItem('user_mail', res.data.user_mail);
          localStorage.setItem('user_id', res.data.user_id);

          console.log('Role:', res.data.role); 
         
          localStorage.setItem('role', res.data.role); 
          if (res.data.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (res.data.role === 'user') {
            navigate('/user/dashboard');
          }
          
          
        } catch (err) {
          setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
      
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="text-primary">
                    Welcome Back <span role="img" aria-label="waving hand">👋</span>
                </h2>
                
                <div className="form-group mb-3">
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Enter your password"
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>

                <p className="text-center">
                    New here? <span className="link" onClick={() => navigate('/register')}>Create Account</span>
                </p>
            </form>
        </div>
    );
};

export default Login;
