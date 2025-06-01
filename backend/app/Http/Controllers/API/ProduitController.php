<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    // Récupérer tous les produits sans doublons
  public function index()
{
    $produits = Produit::with('stockMovements')->get()->map(function ($produit) {
        $entrees = $produit->stockMovements->where('type', 'entrée')->sum('quantite');
        $sorties = $produit->stockMovements->where('type', 'sortie')->sum('quantite');
        $ajustements = $produit->stockMovements->where('type', 'ajustement')->sum('quantite');

        return [
            'id' => $produit->id,
            'nom' => $produit->nom,
            'description' => $produit->description,
            'prix_unitaire' => $produit->prix_unitaire,
            'stock_initial' => $produit->stock_initial,
            'stock_actuel' => $produit->stock_initial + $entrees + $ajustements - $sorties,
            'created_at' => $produit->created_at,
        ];
    });

    return response()->json($produits);
}
public function getStockData($id)
{
    $produit = Produit::with('stockMovements')->find($id);

    if (!$produit) {
        return response()->json(['message' => 'Produit non trouvé'], 404);
    }

    $entrees = $produit->stockMovements->where('type', 'entrée')->sum('quantite');
    $sorties = $produit->stockMovements->where('type', 'sortie')->sum('quantite');
    $ajustements = $produit->stockMovements->where('type', 'ajustement')->sum('quantite');

    $stockActuel = $produit->stock_initial + $entrees + $ajustements - $sorties;

    return response()->json([
        'stock_actuel' => $stockActuel,
        'stock_max' => 1000 // ou tu peux stocker une vraie valeur si besoin
    ]);
}


    // Récupérer un produit par son ID (optionnel)
    public function show($id)
    {
        $produit = Produit::find($id);

        if (!$produit) {
            return response()->json(['message' => 'Produit non trouvé'], 404);
        }

        return response()->json($produit);
    }
}
