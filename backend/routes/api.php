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
use App\Http\Controllers\DashboardController;


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

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/orders-stats', [DashboardController::class, 'getOrdersStats']);
    Route::get('/admin/stock-movements', [DashboardController::class, 'getStockMovements']);
    Route::get('/admin/clients-growth', [DashboardController::class, 'getClientsGrowth']);
    Route::get('/admin/metrics', [DashboardController::class, 'getMetrics']);
});

Route::middleware('auth:admin')->group(function () {
    Route::get('/admin/orders', [CommandeController::class, 'index']);
    Route::delete('/admin/orders/{id}', [CommandeController::class, 'destroy']);
    Route::put('/admin/orders/{id}/update-status', [CommandeController::class, 'updateStatus']);

    Route::put('/admin/orders/{id}/update', function ($id, Request $request) {
        $commande = \App\Models\Commande::findOrFail($id);
        $commande->heure_estimee_livraison = $request->heure_estimee_livraison;
        $commande->save();

        return response()->json(['message' => 'Heure de livraison mise à jour.']);
    });

    Route::post('/admin/livreurs', [LivreurController::class, 'store']);
    Route::delete('/admin/livreurs/{id}', [LivreurController::class, 'destroy']);
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
Route::get('/livreur/stats', function (Request $request) {
        $livreur = $request->user();
        
        $orders = $livreur->commandes()->get();
        
        $totalRevenue = $orders->sum('prix_total');
        $totalOrders = $orders->count();
        $uniqueClients = $orders->groupBy('client_id')->count();
        $successRate = $orders->whereIn('statut', ['livrée', 'livree'])->count() / max(1, $totalOrders) * 100;
        
        // Ici vous devriez aussi calculer les variations par rapport au mois dernier
        
        return response()->json([
            'total_revenue' => ['value' => $totalRevenue, 'change' => 12.5], // Exemple
            'total_orders' => ['value' => $totalOrders, 'change' => 8.2],
            'unique_clients' => ['value' => $uniqueClients, 'change' => 5.7],
            'delivery_success_rate' => ['value' => $successRate, 'change' => 2.3],
        ]);
    });

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/client/profile', [ClientController::class, 'profile']);
    Route::put('/client/profile', [ClientController::class, 'updateProfile']); 
    Route::get('/client/commandes', [ClientController::class, 'mesCommandes']);
    Route::get('/client/commandes/{id}', [ClientController::class, 'detailsCommande']);
    Route::get('/client/factures', [ClientController::class, 'factures']);
    Route::put('/client/orders/{id}/cancel', [ClientController::class, 'annulerCommande']);
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

Route::get('/produits/{id}/stock', [ProduitController::class, 'getStockData']);
Route::get('/clients/regions', [ClientController::class, 'clientsParRegion']);
Route::middleware('auth:sanctum')->post('/unlock', [AuthController::class, 'unlock']);