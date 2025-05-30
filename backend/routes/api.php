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
use App\Http\Controllers\API\StockMovementController;
use App\Http\Controllers\API\ProduitController;
use App\Http\Controllers\API\FactureController;
use App\Http\Controllers\API\AdminProfileController;
use App\Http\Controllers\API\NotificationController;


// notifications 
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
});


//Routes de l'Admin
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/profile', [AdminProfileController::class, 'show']);
    Route::put('/admin/profile', [AdminProfileController::class, 'update']);
});


Route::get('/admin/produits', [ProduitController::class, 'index']);
Route::get('/admin/produits/{id}', [ProduitController::class, 'show']); 

Route::middleware('auth:admin')->group(function () {
    Route::post('/admin/livreurs', [LivreurController::class, 'store']);
});

Route::get('/admin/livreurlist', [LivreurController::class, 'index']);
Route::get('/admin/livreurlist/latest', [LivreurController::class, 'latest']);

Route::get('/admin-logs', [AdminLogController::class, 'index'])->middleware('auth:sanctum');
Route::get('/admin-logs/export-csv', [AdminLogExportController::class, 'exportCsv']);

Route::get('/admin/clientslist', [ClientController::class, 'index']);
Route::delete('admin/clientslist/{id}', [ClientController::class, 'destroy']);
Route::get('/admin/clientslist/latest', [ClientController::class, 'latest']);

Route::get('/admin/orders', [CommandeController::class, 'index']);
Route::delete('/admin/orders/{id}', [CommandeController::class, 'destroy']);

Route::put('/admin/orders/{id}/update', function ($id, Request $request) {
    $commande = \App\Models\Commande::findOrFail($id);
    $commande->heure_estimee_livraison = $request->heure_estimee_livraison;
    $commande->save();

    return response()->json(['message' => 'Heure de livraison mise à jour.']);
});


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/stock', [StockMovementController::class, 'index']);
    Route::post('/admin/stock', [StockMovementController::class, 'store']);
});



Route::get('/facture/{id}', [FactureController::class, 'show']);


// Routes Livreurs
// Route::get('/livreur/orders', [CommandeController::class, 'index']);
// routes/api.php

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/livreur/orders', [CommandeController::class, 'ordersForLivreur']);
});

Route::middleware('auth:sanctum')->get('/livreur/commandes', [CommandeController::class, 'index']);
Route::put('/livreur/orders/{id}/update', function ($id, Request $request) {
    $commande = \App\Models\Commande::findOrFail($id);
    $commande->heure_estimee_livraison = $request->heure_estimee_livraison;
    $commande->save();

    return response()->json(['message' => 'Heure de livraison mise à jour.']);
});
Route::put('/livreur/orders/{id}/update-status', [CommandeController::class, 'updateStatus']);

Route::middleware('auth:livreur')->group(function () {
    Route::get('/livreur/profile', [LivreurController::class, 'profile']);
    Route::put('/livreur/profile', [LivreurController::class, 'updateProfile']);
});



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

