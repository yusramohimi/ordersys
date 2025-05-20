<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\Commande;
use App\Models\Produit;
use App\Models\CodePromo;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ClientCredentialsMail;

class CommandeController extends Controller
{
    public function commander(Request $request)
    {
        DB::beginTransaction();
        try {
            $password = Str::random(10);
            $client = Client::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'email' => $request->email,
                'telephone' => $request->telephone,
                'ville' => $request->ville,
                'region_id' => $request->region,
                'adresse' => $request->adresse,
                'password' => bcrypt($password)
            ]);
            Mail::to($client->email)->send(new ClientCredentialsMail($client->email, $password));
            $produit = Produit::first();
            if (!$produit) {
                throw new \Exception('Produit introuvable');
            }

            $quantite = $request->quantite;
            $subtotal = $produit->prix_unitaire * $quantite;
            $reduction = 0;

            if ($request->promo_id) {
                $promo = CodePromo::find($request->promo_id);
                if ($promo) {
                    if ($promo->type === 'montant') {
                        $reduction = $promo->reduction;
                    } elseif ($promo->type === 'pourcentage') {
                        $reduction = $subtotal * ($promo->reduction / 100);
                    }
                }
            }

            $prix_total = max(0, $subtotal - min($reduction, $subtotal));
            $commande = Commande::create([
                'client_id' => $client->id,
                'code_promo_id' => $request->promo_id,
                'prix_total' => $prix_total,
                'statut' => 'en_attente'
            ]);

            DB::table('commande_produit')->insert([
                'commande_id' => $commande->id,
                'produit_id' => $produit->id,
                'quantite' => $quantite,
                'prix_unitaire' => $produit->prix_unitaire,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            if ($request->promo_id) {
                CodePromo::where('id', $request->promo_id)->increment('utilisations_actuelles');
            }

            DB::commit();
            return response()->json(['success' => true, 'commande_id' => $commande->id]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()]);
        }
    }
    public function index()
    {
        try {
            $commandes = Commande::with('client')->get();

            $result = $commandes->map(function ($cmd) {
                return [
                    'id' => $cmd->id,
                    'client_id' => $cmd->client_id,
                    'client_name' => $cmd->client ? $cmd->client->nom_complet : null,
                    'adresse' => $cmd->client ? $cmd->client->adresse : null,
                    'prix_total' => $cmd->prix_total,
                    'status' => $cmd->statut,
                    'created_at' => $cmd->created_at,
                    'heure_estimee_livraison' => $cmd->heure_estimee_livraison,
                ];
            });

            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des commandes: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur serveur'], 500);
        }
    }
    public function updateStatus($id, Request $request)
    {
        // Valider le statut reçu
        $request->validate([
            'statut' => 'required|string|in:en_attente,en_cours,livree,annulee' // adapte selon tes statuts
        ]);

        try {
            $commande = Commande::findOrFail($id);
            $commande->statut = $request->statut;
            $commande->save();

            return response()->json(['message' => 'Statut de la commande mis à jour.', 'statut' => $commande->statut]);
        } catch (\Exception $e) {
            Log::error('Erreur mise à jour statut commande : ' . $e->getMessage());
            return response()->json(['error' => 'Erreur serveur lors de la mise à jour du statut'], 500);
        }
    }


    public function destroy($id)
    {
        try {
            $commande = Commande::findOrFail($id);
            $commande->delete();

            return response()->json(['message' => 'Commande supprimée avec succès']);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression de la commande: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la suppression'], 500);
        }
    }
}
