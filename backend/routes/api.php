<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Models\Region;
use App\Models\CodePromo;
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
