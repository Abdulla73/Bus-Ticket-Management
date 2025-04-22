<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Bus;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'bus_id' => 'required|exists:buses,id',
            'price' => 'required|numeric|min:0',
        ]);

        $bus = Bus::findOrFail($request->bus_id);

        // Check if a ticket already exists for the bus
        if ($bus->ticket) {
            return response()->json(['message' => 'Ticket already exists for this bus.'], 400);
        }

        $ticket = Ticket::create([
            'bus_id' => $bus->id,
            'price' => $request->price,
            'total_seats' => $bus->total_seats,
            'available_seats' => $bus->total_seats,
            'departure_time' => $bus->departure_time,
        ]);

        return response()->json(['message' => 'Ticket created successfully.', 'ticket' => $ticket], 201);
    }

    public function update(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        $request->validate([
            'price' => 'sometimes|numeric|min:0',
        ]);

        $ticket->update($request->only('price'));

        return response()->json(['message' => 'Ticket updated successfully.', 'ticket' => $ticket]);
    }

    public function index()
    {
        $tickets = Ticket::with('bus')->get();
        return response()->json($tickets);
    }

    public function show($id)
    {
        $ticket = Ticket::with('bus')->findOrFail($id);
        return response()->json($ticket);
    }


    public function searchAvailableBuses(Request $request)
    {
        $request->validate([
            'from' => 'required|string',
            'to' => 'required|string',
            'date' => 'required|date',
        ]);

        $buses = Bus::where('from', $request->from)
            ->where('to', $request->to)
            ->whereDate('departure_time', $request->date)
            ->with('ticket')
            ->get()
            ->filter(function ($bus) {
                return $bus->ticket && $bus->ticket->available_seats > 0;
            })
            ->map(function ($bus) {
                return [
                    'bus_number' => $bus->bus_number,
                    'available_seats' => $bus->ticket->available_seats,
                    'departure_time' => $bus->departure_time,
                    'seat_price' => $bus->ticket->price,
                ];
            });

        if ($buses->isEmpty()) {
            return response()->json(['message' => 'No buses found for your search. 🥺'], 404);
        }

        return response()->json([
            'message' => 'Available buses retrieved successfully!',
            'buses' => $buses
        ]);
    }
}
