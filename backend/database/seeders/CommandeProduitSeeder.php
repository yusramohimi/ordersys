<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Produit;

class CommandeProduitSeeder extends Seeder
{
    public function run()
    {
        $produits = Produit::all();

        for ($i = 0; $i < 10; $i++) {
            $produit = $produits->random();

            DB::table('commande_produit')->insert([
                'commande_id'   => rand(18, 29),
                'produit_id'    => $produit->id,
                'quantite'      => rand(1, 5),
                'prix_unitaire' => $produit->prix_unitaire,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);
        }
    }
}
