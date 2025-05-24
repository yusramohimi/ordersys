<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Commande;

class FactureController extends Controller
{
   // app/Http/Controllers/API/FactureController.php
public function show($id)
{
    $commande = Commande::with(['client', 'produits', 'codePromo'])->findOrFail($id);

    return response()->json([
        'id' => $commande->id,
        'created_at' => $commande->created_at->toDateString(),
        'prix_total' => $commande->prix_total,
        'client' => [
            'nom' => $commande->client->nom,
            'prenom' => $commande->client->prenom,
            'email' => $commande->client->email,
            'telephone' => $commande->client->telephone,
            'adresse' => $commande->client->adresse,
            'ville' => $commande->client->ville,
        ],
        'produits' => $commande->produits->map(function ($p) {
            return [
                'nom' => $p->nom,
                'prix_unitaire' => $p->prix_unitaire,
                'quantite' => $p->pivot->quantite,
                'total' => $p->prix_unitaire * $p->pivot->quantite,
            ];
        }),
        'code_promo' => $commande->codePromo ? [
            'code' => $commande->codePromo->code,
            'valeur' => $commande->codePromo->valeur,
            'type' => $commande->codePromo->type, // pourcentage ou montant
        ] : null,
    ]);
}

}
