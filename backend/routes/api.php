<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Models\Region;
use App\Models\CodePromo;
use App\Http\Controllers\API\CommandeController;
use App\Http\Controllers\LivreurController;
use App\Http\Controllers\API\AdminLogController;
use App\Http\Controllers\API\AdminLogExportController;
use App\Http\Controllers\ClientController;


Route::post('/admin/livreurs', [LivreurController::class, 'store']);
Route::get('/admin/livreurlist', [LivreurController::class, 'index']);
Route::get('/admin/livreurlist/latest', [LivreurController::class, 'latest']);


Route::get('/admin/clientslist', [ClientController::class, 'index']);
Route::delete('admin/clientslist/{id}', [ClientController::class, 'destroy']);
Route::get('/admin/clientslist/latest', [ClientController::class, 'latest']);

Route::get('/admin/orders', [CommandeController::class, 'index']);
Route::delete('/admin/orders/{id}', [CommandeController::class, 'destroy']);

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
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::get('/admin-logs', [AdminLogController::class, 'index'])->middleware('auth:sanctum');
Route::get('/admin-logs/export-csv', [AdminLogExportController::class, 'exportCsv']);