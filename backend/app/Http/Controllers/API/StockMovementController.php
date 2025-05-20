<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StockMovement;
use App\Models\Produit;
use App\Traits\LogsAdminActions;

class StockMovementController extends Controller
{
    use LogsAdminActions;
    public function index()
    {
        return response()->json(StockMovement::with('produit')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'type' => 'required|in:entrée,sortie,ajustement',
            'quantite' => 'required|integer|min:1',
            'motif' => 'nullable|string'
        ]);

        $mouvement = StockMovement::create($validated);

        
        $this->logAdminAction(
            'create',
            'StockMovement',          
            $mouvement->id,           
            [
                'produit_id' => $mouvement->produit_id,
                'type' => $mouvement->type,
                'quantite' => $mouvement->quantite,
                'motif' => $mouvement->motif
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Mouvement de stock enregistré avec succès',
            'data' => $mouvement
        ]);
    }
}
