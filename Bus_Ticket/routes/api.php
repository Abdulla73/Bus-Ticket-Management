<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Registration;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\BusController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\BookingController;

Route::post('register', [Registration::class, 'register']);
Route::post('verify-otp', [Registration::class, 'verifyOtp']);
Route::post('login', [LoginController::class, 'login']);
Route::post('logout', [LoginController::class, 'logout']);

Route::post('buses', [BusController::class, 'store']);           // Add Bus
Route::put('buses/{id}', [BusController::class, 'update']);       // Update Bus
Route::delete('buses/{id}', [BusController::class, 'destroy']);   // Delete Bus
Route::get('buses', [BusController::class, 'index']);             // List/Search Buses
Route::get('buses/{id}', [BusController::class, 'show']);         // Show Single Bus

// TICKET Routes
Route::post('tickets', [TicketController::class, 'store']);       // Add Ticket
Route::put('tickets/{id}', [TicketController::class, 'update']);  // Update Ticket
Route::get('tickets', [TicketController::class, 'index']);        // List/Search Tickets
Route::get('tickets/{id}', [TicketController::class, 'show']);
Route::get('search-available-buses', [TicketController::class, 'searchAvailableBuses']);
   // Show Single Ticket

// BOOKING Routes
Route::post('book-seat', [BookingController::class, 'store']);    // Customer books seat
Route::get('bookings', [BookingController::class, 'index']);
Route::get('search-bookings/{userId}', [BookingController::class, 'searchByUser']);

