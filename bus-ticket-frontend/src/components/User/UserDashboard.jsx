import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/user.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
  });
  const [buses, setBuses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem('user_mail');
    const id = localStorage.getItem('user_id');
    setUserEmail(email || 'Unknown User');

    if (id) {
      fetchBookings(id);
    }
  }, []);

  const fetchBookings = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/search-bookings/${id}`);
      if (res.data.bookings) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookings([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setBuses([]);

    try {
      const params = {
        from: searchData.from,
        to: searchData.to,
        date: new Date(searchData.date).toISOString().slice(0, 10),
      };

      const res = await axios.get('http://localhost:8000/api/search-available-buses', {
        params,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.data.buses && res.data.buses.length > 0) {
        setBuses(res.data.buses);
      } else {
        setErrorMessage('No buses found.');
      }
    } catch (err) {
      console.error('Error searching buses:', err);
      setErrorMessage(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_mail');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary mb-0">Bus Lagbe</h1>
        <div className="text-end">
          <small className="text-muted">Logged in as:</small><br />
          <strong>{userEmail}</strong>
          <br />
          <button 
            className="btn btn-danger btn-sm mt-2"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="card p-4 mb-5 shadow-sm rounded">
        <h4 className="text-center mb-4">Search Buses</h4>
        <div className="row">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              name="from"
              className="form-control"
              placeholder="From"
              value={searchData.from}
              onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="text"
              name="to"
              className="form-control"
              placeholder="To"
              value={searchData.to}
              onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="date"
              name="date"
              className="form-control"
              value={searchData.date}
              onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-success btn-sm px-5">Search</button>
        </div>
      </form>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {buses.length > 0 ? (
        <div>
          <h4 className="mb-3 text-center">Available Buses</h4>
          <div className="list-group">
            {buses.map((bus) => (
              <div key={bus.bus_number} className="list-group-item list-group-item-action mb-3 shadow-sm p-4 rounded">
                <h5 className="text-primary">{bus.bus_number}</h5>
                <p><strong>Departure:</strong> {new Date(bus.departure_time).toLocaleString()}</p>
                <p><strong>Seats Available:</strong> {bus.available_seats}</p>
                <p><strong>Price:</strong> {bus.seat_price} Tk</p>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate('/user/buy-ticket', { state: { bus } })}
                >
                  Buy Ticket
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No buses available at this time.</p>
      )}

      <hr className="my-5" />

      <div>
        <h4 className="mb-3 text-center">Your Bookings</h4>
        {bookings.length > 0 ? (
          <div className="list-group">
            {bookings.map((booking) => (
              <div key={booking.ticket_id} className="list-group-item list-group-item-action mb-3 shadow-sm p-4 rounded">
                <h5 className="text-success">Ticket ID: {booking.ticket_id}</h5>
                <p><strong>Bus Number:</strong> {booking.bus_number}</p>
                <p><strong>Seat:</strong> {booking.seat_number}</p>
                <p><strong>From:</strong> {booking.from} <strong>To:</strong> {booking.to}</p>
                <p><strong>Departure:</strong> {new Date(booking.departure_time).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No bookings yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
