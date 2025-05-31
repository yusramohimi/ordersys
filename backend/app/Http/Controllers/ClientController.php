<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Commande;
use Illuminate\Http\Request;

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
        $user = $request->user();

        if (!$user instanceof Client) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $user->update($request->only(['nom', 'prenom', 'telephone', 'email', 'adresse']));

        return response()->json(['message' => 'Profil mis à jour', 'client' => $user]);
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
}
