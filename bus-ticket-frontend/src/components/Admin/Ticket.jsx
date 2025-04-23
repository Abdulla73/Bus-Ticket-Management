
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const token = localStorage.getItem('token');
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { Authorization: `Bearer ${token}` },
});

const Ticket = () => {
  const location = useLocation();
  const busId = location.state?.busId;

  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({
    bus_id: busId || '',
    price: '',
    total_seats: '',
    available_seats: '',
    departure_time: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateTicketId, setUpdateTicketId] = useState(null);

  const fetchTickets = async () => {
    try {
      const res = await axiosInstance.get('/tickets');
      setTickets(res.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBusInfo = async () => {
      if (busId) {
        try {
          const res = await axiosInstance.get(`/buses/${busId}`);
          const busData = res.data;
          setFormData((prev) => ({
            ...prev,
            bus_id: busData.id,
            total_seats: busData.total_seats,
            available_seats: busData.total_seats,
            departure_time: new Date(busData.departure_time)
              .toISOString()
              .slice(0, 16), // datetime-local format
          }));
        } catch (err) {
          console.error('Error fetching bus info:', err);
        }
      }
    };
    fetchBusInfo();
  }, [busId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isUpdating && updateTicketId) {
        await axiosInstance.put(`/tickets/${updateTicketId}`, {
          price: parseFloat(formData.price),
        });
      } else {
        await axiosInstance.post('/tickets', {
          ...formData,
          price: parseFloat(formData.price),
          total_seats: parseInt(formData.total_seats, 10),
          available_seats: parseInt(formData.available_seats, 10),
        });
      }
      setFormData({
        bus_id: busId || '',
        price: '',
        total_seats: formData.total_seats,
        available_seats: formData.available_seats,
        departure_time: formData.departure_time,
      });
      setIsUpdating(false);
      setUpdateTicketId(null);
      fetchTickets();
    } catch (err) {
      console.error('Error submitting ticket:', err.response?.data || err.message);
    }
  };

  const handleEdit = (ticket) => {
    setFormData({
      bus_id: ticket.bus_id,
      price: ticket.price,
      total_seats: ticket.total_seats,
      available_seats: ticket.available_seats,
      departure_time: new Date(ticket.departure_time)
        .toISOString()
        .slice(0, 16),
    });
    setIsUpdating(true);
    setUpdateTicketId(ticket.id);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">{isUpdating ? 'Update Ticket' : 'Add Ticket'}</h2>
      <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-lg">
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="number"
              name="bus_id"
              className="form-control"
              value={formData.bus_id}
              readOnly
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="number"
              name="total_seats"
              className="form-control"
              value={formData.total_seats}
              readOnly
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="number"
              name="available_seats"
              className="form-control"
              value={formData.available_seats}
              readOnly
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="datetime-local"
              name="departure_time"
              className="form-control"
              value={formData.departure_time}
              readOnly
            />
          </div>
          <div className="col-md-12 mb-3">
            <input
              type="number"
              name="price"
              className="form-control"
              placeholder="Enter Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button type="submit" className={`btn w-100 ${isUpdating ? 'btn-warning' : 'btn-primary'}`}>
          {isUpdating ? 'Update Ticket' : 'Add Ticket'}
        </button>
      </form>

      <h4 className="text-center mb-3">All Tickets</h4>
      <div className="table-responsive">
        <table className="table table-bordered shadow-sm">
          <thead className="thead-dark">
            <tr>
              <th>Ticket ID</th>
              <th>Bus ID</th>
              <th>Price</th>
              <th>Total Seats</th>
              <th>Available Seats</th>
              <th>Departure Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.bus_id}</td>
                <td>{ticket.price}</td>
                <td>{ticket.total_seats}</td>
                <td>{ticket.available_seats}</td>
                <td>{new Date(ticket.departure_time).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(ticket)}
                  >
                    Update
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

export default Ticket;
