<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'user_id' => 'required|exists:users,id',
            'seat_number' => 'required|string|max:10',
        ]);

        $ticket = Ticket::findOrFail($request->ticket_id);

        $seatAlreadyBooked = Booking::where('ticket_id', $ticket->id)
            ->where('seat_number', $request->seat_number)
            ->exists();

        if ($seatAlreadyBooked) {
            return response()->json(['message' => 'Seat already booked. Choose another one!'], 400);
        }

        if ($ticket->available_seats < 1) {
            return response()->json(['message' => 'No seats available. Sorry!'], 400);
        }

        $booking = Booking::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user_id,
            'seat_number' => $request->seat_number,
        ]);

        $ticket->decrement('available_seats');

        return response()->json([
            'message' => 'Seat booked successfully!',
            'booking' => $booking
        ], 201);
    }

    public function index()
    {
        $bookings = Booking::select('ticket_id', 'seat_number')->get();

        return response()->json([
            'message' => 'Ticket ID and Seat Number retrieved successfully!',
            'bookings' => $bookings
        ]);
    }


    public function searchByUser($userId)
    {
        $bookings = Booking::where('user_id', $userId)
            ->with(['ticket.bus'])
            ->get()
            ->map(function ($booking) {
                return [
                    'ticket_id' => $booking->ticket->id,
                    'seat_number' => $booking->seat_number,
                    'bus_number' => $booking->ticket->bus->bus_number,
                    'from' => $booking->ticket->bus->from,
                    'to' => $booking->ticket->bus->to,
                    'departure_time' => $booking->ticket->departure_time,
                ];
            });

        if ($bookings->isEmpty()) {
            return response()->json(['message' => 'No bookings found for this user.'], 404);
        }

        return response()->json([
            'message' => 'Bookings found!',
            'bookings' => $bookings
        ]);
    }

    public function getSeatsByTicketId($id)
    {
        $seats = Booking::where('ticket_id', $id)
            ->pluck('seat_number');

        if ($seats->isEmpty()) {
            return response()->json(['message' => 'No seats found for this ticket ID.'], 404);
        }

        return response()->json([
            'message' => 'Seats retrieved successfully!',
            'seats' => $seats
        ]);
    }
}
