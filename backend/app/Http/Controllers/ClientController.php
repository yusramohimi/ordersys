<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
class ClientController extends Controller
{
    public function index()
    {
        return response()->json(Client::all());
    }

    public function destroy($id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        $client->delete();

        return response()->json(['message' => 'Client deleted']);
    }

    public function latest()
    {
        $latestClients = Client::orderBy('created_at', 'desc')->take(5)->get();
        return response()->json($latestClients);
    }

    public function profile(Request $request)
    {
        $user = $request->user();

        if (!$user instanceof Client) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        return response()->json($user);
    }

    public function updateProfile(Request $request)
{
    $client = $request->user();

    if (!$client instanceof Client) {
        return response()->json(['message' => 'Non autorisé'], 403);
    }

    // Mettre à jour les infos de profil de base
    $client->fill($request->only(['nom', 'prenom', 'telephone', 'email', 'adresse']));

    // Mettre à jour le mot de passe si demandé
    if ($request->filled('new_password')) {
        $request->validate([
            'new_password' => 'required|string|min:6',
            'new_password_confirmation' => 'required|same:new_password',
        ]);

        $client->password = Hash::make($request->new_password);
    }

    $client->save();

    return response()->json(['message' => 'Profil mis à jour avec succès.', 'client' => $client]);
}


    public function mesCommandes(Request $request)
    {
        $user = $request->user();

        if (!$user instanceof Client) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        return response()->json($user->commandes()->with('produits', 'facture')->latest()->get());
    }

    public function detailsCommande(Request $request, $id)
    {
        $user = $request->user();

        if (!$user instanceof Client) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $commande = Commande::with('produits', 'facture')->findOrFail($id);

        if ($commande->client_id !== $user->id) {
            return response()->json(['message' => 'Accès interdit à cette commande'], 403);
        }

        return response()->json($commande);
    }

    public function factures(Request $request)
    {
        $user = $request->user();

        if (!$user instanceof Client) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $factures = $user->commandes()->with('facture')->get()->pluck('facture')->filter();

        return response()->json($factures->values());
    }
   
    public function annulerCommande($id, Request $request)
    {
        $commande = Commande::where('id', $id)
            ->where('client_id', $request->user()->id)
            ->first();

        if (!$commande) {
            return response()->json(['message' => 'Commande introuvable ou non autorisée.'], 404);
        }

        $commande->statut = 'annulée';
        $commande->save();

        return response()->json(['message' => 'Commande annulée avec succès.']);
    }

public function clientsParRegion()
{
    $clientsParRegion = DB::table('clients')
        ->join('regions', 'clients.region_id', '=', 'regions.id')
        ->select('regions.nom as region', DB::raw('count(*) as total'))
        ->groupBy('regions.nom')
        ->orderByDesc('total')
        ->get();

    return response()->json($clientsParRegion);
}
}
