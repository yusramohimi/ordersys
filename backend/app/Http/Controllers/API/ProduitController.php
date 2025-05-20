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
        // Ici on récupère tous les produits distincts par leur ID
        $produits = Produit::select('produits.*')->distinct()->get();

        return response()->json($produits);
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
