
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const token = localStorage.getItem('token');
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { Authorization: `Bearer ${token}` },
});

const UpdateBus = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bus_number: '',
    from: '',
    to: '',
    total_seats: '',
    departure_time: '',
  });

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await axiosInstance.get(`/buses/${id}`);
        const busData = res.data;

        const formattedDepartureTime = new Date(busData.departure_time)
          .toISOString()
          .slice(0, 16); 

        setFormData({
          bus_number: busData.bus_number,
          from: busData.from,
          to: busData.to,
          total_seats: busData.total_seats,
          departure_time: formattedDepartureTime,
        });
      } catch (err) {
        console.error('Error fetching bus data:', err);
      }
    };

    fetchBus();
  }, [id]); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/buses/${id}`, {
        ...formData,
        total_seats: parseInt(formData.total_seats, 10), 
      });
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Error updating bus', err.response?.data || err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Update Bus</h2>
      <form onSubmit={handleUpdate} className="card p-4 mb-4 shadow-lg">
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="bus_number"
              className="form-control"
              placeholder="Bus Number"
              value={formData.bus_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="from"
              className="form-control"
              placeholder="From"
              value={formData.from}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="to"
              className="form-control"
              placeholder="To"
              value={formData.to}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="number"
              name="total_seats"
              className="form-control"
              placeholder="Total Seats"
              value={formData.total_seats}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-12 mb-3">
            <input
              type="datetime-local"
              name="departure_time"
              className="form-control"
              value={formData.departure_time}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-warning w-100">Update Bus</button>
      </form>
    </div>
  );
};

export default UpdateBus;
