<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AdminProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user()); // retourne l'admin connecté
    }

    public function update(Request $request)
    {
        $admin = $request->user();

        $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email,' . $admin->id,
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        $admin->nom = $request->nom;
        $admin->email = $request->email;

        if ($request->password) {
            $admin->password = Hash::make($request->password);
        }

        $admin->save();

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'admin' => $admin,
        ]);
    }
}
