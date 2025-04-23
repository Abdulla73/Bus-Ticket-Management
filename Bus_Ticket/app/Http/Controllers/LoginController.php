<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Your account is not active. Please verify your email.'], 403);
        }

        $customClaims = [
            'email' => $user->email,
            'role' => $user->role,
        ];

        $token = JWTAuth::claims($customClaims)->fromUser($user);

        session(['user_email' => $user->email]);

        $welcomeMessage = $user->role === 'admin' ? 'Welcome Admin!' : 'Welcome User!';

        return response()->json([
            'message' => $welcomeMessage,
            'token' => $token,
            'role' => $user->role,
            'user_mail' => $user->email,
            'user_id' => $user->id,
        ], 200);
    }

    public function sessionUser(Request $request)
    {
        $userEmail = session('user_email');
        if ($userEmail) {
            return response()->json(['user_email' => $userEmail], 200);
        } else {
            return response()->json(['message' => 'No active session'], 401);
        }
    }


    public function logout(Request $request)
    {
        Session::flush();
        return response()->json(['message' => 'Logged out successfully.'], 200);
    }
}
