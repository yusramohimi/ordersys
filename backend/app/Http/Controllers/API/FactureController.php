<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Facture;
use App\Notifications\FactureGenereeNotification;

class FactureController extends Controller
{
    public function show($id)
{
    $commande = Commande::with(['client', 'produits', 'codePromo', 'facture'])->findOrFail($id);

    $facture = $commande->facture;

    if (!$facture) {
        $facture = Facture::create([
            'commande_id' => $commande->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($commande->client) {
            $commande->client->notify(new FactureGenereeNotification($facture->id, $commande->id));
        }
    }

    return response()->json([
        'id' => $commande->id,
        'created_at' => $facture->created_at->toDateString(),
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
            'type' => $commande->codePromo->type,
        ] : null,
    ]);
}

}
