import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../style/buyticket.css';

const BuyTicket = () => {
    const location = useLocation();
    const { bus } = location.state || {};
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState('');
    const navigate = useNavigate();

    const ticketId = bus?.ticket_id; 

    const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatCols = ['1', '2', '3', '4'];

    useEffect(() => {
        const fetchBookedSeats = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/tickets/${ticketId}/seats`);
                setBookedSeats(res.data.seats || []);
            } catch (err) {
                console.error('Error fetching booked seats:', err);
            }
        };

        if (ticketId) {
            fetchBookedSeats();
        }
    }, [ticketId]); 

    const handleSeatSelect = (seat) => {
        if (!bookedSeats.includes(seat)) {
            setSelectedSeat(seat);
        }
    };

    const handleBuyTicket = async () => {
        if (!selectedSeat) return;

        const userId = localStorage.getItem('user_id'); 

        if (!userId) {
            alert('User not logged in properly! ');
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/book-seat', {
                ticket_id: ticketId,
                user_id: userId,
                seat_number: selectedSeat,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            alert(`Congrats Seat ${selectedSeat} booked successfully!`);
            navigate('/user/dashboard'); 
        } catch (err) {
            console.error('Booking error:', err);
            alert('Failed to book seat. Please try again! ');
        }
    };
    return (
        <div className="container mt-5 text-center">
            <h2 className="mb-4">Please select your seat </h2>

            <div className="seat-map d-flex flex-column align-items-center">
                {seatRows.map((row) => (
                    <div key={row} className="d-flex justify-content-center mb-2">
                        {seatCols.map((col) => (
                            <div key={`${row}${col}`} className="mx-2">
                                <input
                                    type="checkbox"
                                    id={`${row}${col}`}
                                    disabled={bookedSeats.includes(`${row}${col}`)}
                                    checked={selectedSeat === `${row}${col}`}
                                    onChange={() => handleSeatSelect(`${row}${col}`)}
                                    className="seat-checkbox"
                                />
                                <label htmlFor={`${row}${col}`} className={`seat-label ${bookedSeats.includes(`${row}${col}`) ? 'booked' : ''}`}>
                                    {row}{col}
                                </label>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <button
                className="btn btn-primary mt-4"
                onClick={handleBuyTicket}
                disabled={!selectedSeat}
            >
                Buy Ticket
            </button>
        </div>
    );
};

export default BuyTicket;
