<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Admin;
use App\Models\Client;
use App\Models\Livreur;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $email = $request->email;
        $password = $request->password;

        // Tentative avec Admin
        $admin = Admin::where('email', $email)->first();
        if ($admin && Hash::check($password, $admin->password)) {
            $token = $admin->createToken('admin-token')->plainTextToken;
            return response()->json([
                'success' => true,
                'token' => $token,
                'user_type' => 'admin',
                'user' => $admin,
            ]);
        }

        // Tentative avec Client
        $client = Client::where('email', $email)->first();
        if ($client && Hash::check($password, $client->password)) {
            $token = $client->createToken('client-token')->plainTextToken;
            return response()->json([
                'token' => $token,
                'user_type' => 'client',
                'user' => $client,
            ]);
        }

        // Tentative avec Livreur
        $livreur = Livreur::where('email', $email)->first();
        if ($livreur && Hash::check($password, $livreur->password)) {
            $token = $livreur->createToken('livreur-token')->plainTextToken;
            return response()->json([
                'token' => $token,
                'user_type' => 'livreur',
                'user' => $livreur,
            ]);
        }

        return response()->json(['message' => 'Identifiants invalides'], 401);
    }
    public function logout(Request $request)
    {
        // Révoque le token actuel de l'utilisateur
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie',
        ]);
    }
}
