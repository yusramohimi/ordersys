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
            'region_id' => 'required|exists:regions,id', 
            'password' => 'required|string|min:6',
        ]);


        $livreur = new Livreur();
        $livreur->nom = $validated['nom'];
        $livreur->email = $validated['email'];
        $livreur->telephone = $validated['telephone'];
        $livreur->password = Hash::make($validated['password']);
        $livreur->region_id = $validated['region_id']; 

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
    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $livreur = $request->user();

        $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:livreurs,email,' . $livreur->id,
            'telephone' => 'required|string',
            'password' => 'nullable|confirmed|min:6'
        ]);

        $livreur->update([
            'nom' => $request->nom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'password' => $request->password ? bcrypt($request->password) : $livreur->password
        ]);

        return response()->json(['message' => 'Profil mis à jour avec succès.']);
    }
    public function destroy($id)
{
    $livreur = Livreur::findOrFail($id);
    $livreur->delete();

    
    if (auth('admin')->check()) {
        $this->logAdminAction(
            'delete',
            'Livreur',
            $livreur->id,
            ['nom' => $livreur->nom]
        );
    }

    return response()->json(['message' => 'Livreur supprimé avec succès.']);
}

}
