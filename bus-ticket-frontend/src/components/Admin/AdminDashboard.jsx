import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/admin.css';

const AdminDashboard = () => {
  const [buses, setBuses] = useState([]);
  const [formData, setFormData] = useState({
    bus_number: '',
    from: '',
    to: '',
    total_seats: '',
    departure_time: '',
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchBuses = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/buses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses(res.data);
    } catch (err) {
      console.error('Error fetching buses:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchBuses();
    const interval = setInterval(fetchBuses, 5000);
    return () => clearInterval(interval);
  }, [fetchBuses]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/buses', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ bus_number: '', from: '', to: '', total_seats: '', departure_time: '' });
      fetchBuses();
    } catch (err) {
      console.error(err.response?.data?.message || 'Error adding bus.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/buses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBuses();
    } catch (err) {
      console.error('Error deleting bus:', err);
    }
  };

  const handleUpdateRedirect = (busId) => {
    navigate(`/admin/update-bus/${busId}`);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Bus Control Panel</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-lg">
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
        <button type="submit" className="btn btn-success w-100">Add Bus</button>
      </form>

      <h4 className="text-center mb-3">All Buses</h4>

      <div className="table-responsive">
        <table className="table table-bordered shadow-sm">
          <thead className="thead-dark">
            <tr>
              <th>Bus No</th>
              <th>From</th>
              <th>To</th>
              <th>Total Seats</th>
              <th>Departure Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id}>
                <td>{bus.bus_number}</td>
                <td>{bus.from}</td>
                <td>{bus.to}</td>
                <td>{bus.total_seats}</td>
                <td>{new Date(bus.departure_time).toLocaleString()}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleUpdateRedirect(bus.id)}>
                    Update
                  </button>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(bus.id)}>Delete</button>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/add-ticket', { state: { busId: bus.id } })}>
                    Add Ticket
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
