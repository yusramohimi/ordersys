<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\Admin;
use App\Models\Client;
use App\Models\Commande;
use App\Models\Produit;
use App\Models\Livreur;
use App\Models\CodePromo;
use App\Mail\ClientCredentialsMail;
use App\Notifications\NouvelleCommandeNotification;
use App\Notifications\CommandeAffecteeLivreurNotification;
use App\Notifications\CommandeClientNotification;
use App\Traits\LogsAdminActions; 

class CommandeController extends Controller
{
    use LogsAdminActions;
    public function commander(Request $request)
    {
        DB::beginTransaction();
        try {
            // Création client
            $password = Str::random(10);
            $client = Client::create([
                'nom'       => $request->nom,
                'prenom'    => $request->prenom,
                'email'     => $request->email,
                'telephone' => $request->telephone,
                'ville'     => $request->ville,
                'region_id' => $request->region,
                'adresse'   => $request->adresse,
                'password'  => bcrypt($password)
            ]);

            Mail::to($client->email)->send(new ClientCredentialsMail($client->email, $password));

            $produit = Produit::first();
            if (!$produit) throw new \Exception('Produit introuvable');

            $quantite = $request->quantite;
            $subtotal = $produit->prix_unitaire * $quantite;
            $reduction = 0;

            if ($request->promo_id) {
                $promo = CodePromo::find($request->promo_id);
                if ($promo) {
                    $reduction = $promo->type === 'montant'
                        ? $promo->reduction
                        : $subtotal * ($promo->reduction / 100);
                }
            }

            $prix_total = max(0, $subtotal - min($reduction, $subtotal));

            // Affecter un livreur de la même région
            $livreur = Livreur::where('region_id', $client->region_id)->inRandomOrder()->first();
            if (!$livreur) throw new \Exception("Aucun livreur disponible pour la région du client.");

            // Créer la commande
            $commande = Commande::create([
                'client_id'     => $client->id,
                'livreur_id'    => $livreur->id,
                'code_promo_id' => $request->promo_id,
                'prix_total'    => $prix_total,
                'statut'        => 'en_attente'
            ]);

            DB::table('commande_produit')->insert([
                'commande_id'   => $commande->id,
                'produit_id'    => $produit->id,
                'quantite'      => $quantite,
                'prix_unitaire' => $produit->prix_unitaire,
                'created_at'    => now(),
                'updated_at'    => now()
            ]);

            if ($request->promo_id) {
                CodePromo::where('id', $request->promo_id)->increment('utilisations_actuelles');
            }

            // 🔔 Notifications
            Admin::all()->each(function ($admin) use ($commande) {
                $admin->notify(new NouvelleCommandeNotification($commande->id));
            });

            $livreur->notify(new CommandeAffecteeLivreurNotification($commande->id));

            DB::commit();
            return response()->json(['success' => true, 'commande_id' => $commande->id]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erreur commande : " . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
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
                    'client_name' => $cmd->client?->nom_complet,
                    'adresse' => $cmd->client?->adresse,
                    'prix_total' => $cmd->prix_total,
                    'statut' => $cmd->statut,
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
        $request->validate([
            'statut' => 'required|string|in:en_attente,confirmée,en_livraison,livrée,retour,annulée'
        ]);

        try {
            $commande = Commande::with('client')->findOrFail($id);
            $commande->statut = $request->statut;
            $commande->save();

            // 🔔 Notifier le client
            if (in_array($commande->statut, ['confirmée', 'livrée'])) {
                $commande->client->notify(new CommandeClientNotification($commande->id, $commande->statut));
            }

            // ✅ Log admin
            $this->logAdminAction(
                'update',
                'Commande',
                $commande->id,
                ['statut' => $commande->statut]
            );

            return response()->json([
                'message' => 'Statut mis à jour',
                'statut' => $commande->statut
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur maj statut commande : ' . $e->getMessage());
            return response()->json(['error' => 'Erreur serveur'], 500);
        }
    }
    public function destroy($id)
    {
        try {
            $commande = Commande::findOrFail($id);
            $commande->delete();

            // ✅ Log admin
            $this->logAdminAction(
                'delete',
                'Commande',
                $commande->id,
                ['prix_total' => $commande->prix_total]
            );

            return response()->json(['message' => 'Commande supprimée avec succès']);
        } catch (\Exception $e) {
            Log::error('Erreur suppression commande : ' . $e->getMessage());
            return response()->json(['error' => 'Erreur serveur'], 500);
        }
    }
    public function ordersForLivreur(Request $request)
    {
        $livreur = $request->user(); // Authentifié via Sanctum

        if (!$livreur || !$livreur instanceof \App\Models\Livreur) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $regionId = $livreur->region_id;

        $commandes = Commande::with('client')
            ->where('livreur_id', $livreur->id)
            ->orWhereHas('client', function ($query) use ($regionId) {
                $query->where('region_id', $regionId);
            })
            ->get();

        return response()->json(
            $commandes->map(function ($cmd) {
                return [
                    'id' => $cmd->id,
                    'client_name' => $cmd->client?->nom_complet,
                    'adresse' => $cmd->client?->adresse,
                    'prix_total' => $cmd->prix_total,
                    'statut' => $cmd->statut,
                    'created_at' => $cmd->created_at,
                    'heure_estimee_livraison' => $cmd->heure_estimee_livraison,
                ];
            })
        );
    }
}
