<?php


namespace App\Http\Controllers;

use App\Models\Livreur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Traits\LogsAdminActions;

class LivreurController extends Controller
{
    use LogsAdminActions;
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:livreurs,email',
            'telephone' => 'required|string|max:20',
            'region_id' => 'required|exists:regions,id', // ✅ AJOUTÉ
            'password' => 'required|string|min:6',
        ]);


        $livreur = new Livreur();
        $livreur->nom = $validated['nom'];
        $livreur->email = $validated['email'];
        $livreur->telephone = $validated['telephone'];
        $livreur->password = Hash::make($validated['password']);
        $livreur->region_id = $validated['region_id']; // ✅ récupéré dynamiquement

        $livreur->save();
        
        $this->logAdminAction(
            'create',
            'Livreur',
            $livreur->id,
            ['nom' => $livreur->nom]
        );

        return response()->json(['message' => 'Livreur ajouté avec succès'], 201);
    }
    public function index()
    {
        return Livreur::with('region')->get();
    }
    public function latest()
    {
        return Livreur::with('region')
        ->orderBy('id', 'desc')
        ->limit(5)
        ->get();
    }
    
}
