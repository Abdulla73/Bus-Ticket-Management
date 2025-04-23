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

Route::middleware(['auth:api', 'isAdmin'])->group(function () {
    Route::post('buses', [BusController::class, 'store']);
    Route::put('buses/{id}', [BusController::class, 'update']);
    Route::delete('buses/{id}', [BusController::class, 'destroy']);
    Route::get('buses', [BusController::class, 'index']);
    Route::get('buses/{id}', [BusController::class, 'show']);
    Route::post('tickets', [TicketController::class, 'store']);
    Route::put('tickets/{id}', [TicketController::class, 'update']);
    Route::get('tickets', [TicketController::class, 'index']);

});

Route::get('/session-user', [LoginController::class, 'sessionUser']);
Route::get('bookings', [BookingController::class, 'index']);
Route::get('tickets/{id}', [TicketController::class, 'show']);
Route::get('search-available-buses', [TicketController::class, 'searchAvailableBuses']);
Route::post('book-seat', [BookingController::class, 'store']);
Route::get('search-bookings/{userId}', [BookingController::class, 'searchByUser']);
Route::get('/tickets/{id}/seats', [BookingController::class, 'getSeatsByTicketId']);
