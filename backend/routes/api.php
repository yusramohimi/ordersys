<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\AuthController;
use App\Models\Region;
use App\Models\CodePromo;
use App\Models\User;
use App\Http\Controllers\API\CommandeController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/regions', function () {
    return Region::all();
});

Route::post('/verifier-code', function (Request $request) {
    $promo = CodePromo::where('code', $request->code)
        ->where('expire_le', '>=', now())
        ->whereColumn('utilisations_actuelles', '<', 'utilisations_max')
        ->first();

    if ($promo) {
        return response()->json([
            'valide' => true,
            'id' => $promo->id, 
            'reduction' => $promo->reduction,
            'type' => $promo->type
        ]);
    } else {
        return response()->json(['valide' => false]);
    }
});



Route::post('/commander', [CommandeController::class, 'commander']);

Route::post('/login', [AuthController::class, 'login']);

Route::post('/register', function (Request $request) {
    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
        'password' => ['required', 'string', 'min:8'],
    ]);

    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => $user,
    ]);
});
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
