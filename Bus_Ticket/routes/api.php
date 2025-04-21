<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Registration;
use App\Http\Controllers\LoginController;

Route::post('register', [Registration::class, 'register']);
Route::post('verify-otp', [Registration::class, 'verifyOtp']);
Route::post('login', [LoginController::class, 'login']);
Route::post('logout', [LoginController::class, 'logout']);
