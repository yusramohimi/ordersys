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

    // Supprimer un client par ID
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
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $client = $request->user();
        $client->update($request->only(['nom', 'prenom', 'telephone', 'email', 'adresse']));
        return response()->json(['message' => 'Profil mis à jour', 'client' => $client]);
    }

    public function mesCommandes(Request $request)
    {
        return response()->json($request->user()->commandes()->with('produits', 'facture')->latest()->get());
    }

    public function detailsCommande($id)
    {
        $commande = Commande::with('produits', 'facture')->findOrFail($id);
        return response()->json($commande);
    }

    public function factures(Request $request)
    {
        return response()->json($request->user()->commandes()->with('facture')->get()->pluck('facture')->filter());
    }
}
