<?php

namespace App\Http\Controllers;

use App\Models\Bus;
use Illuminate\Http\Request;

class BusController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'bus_number' => 'required|string|unique:buses,bus_number',
            'from' => 'required|string',
            'to' => 'required|string',
            'total_seats' => 'required|integer',
            'departure_time' => 'required|date',
        ]);

        $bus = Bus::create([
            'bus_number' => $request->bus_number,
            'from' => $request->from,
            'to' => $request->to,
            'total_seats' => $request->total_seats,
            'departure_time' => $request->departure_time,
        ]);

        return response()->json([
            'message' => 'Bus added successfully',
            'bus' => $bus
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $bus = Bus::findOrFail($id);

        $request->validate([
            'bus_number' => 'sometimes|unique:buses,bus_number,' . $bus->id,
            'from' => 'sometimes|string',
            'to' => 'sometimes|string',
            'total_sits' => 'sometimes|integer|min:1',
            'departure_time' => 'sometimes|date',
        ]);

        $bus->update($request->all());

        return response()->json(['message' => 'Bus updated successfully.', 'bus' => $bus]);
    }

    public function destroy($id)
    {
        $bus = Bus::findOrFail($id);
        $bus->delete();

        return response()->json(['message' => 'Bus deleted successfully.']);
    }

    public function index()
    {
        $buses = Bus::all();
        return response()->json($buses);
    }

    public function show($id)
    {
        $bus = Bus::findOrFail($id);
        return response()->json($bus);
    }
}
