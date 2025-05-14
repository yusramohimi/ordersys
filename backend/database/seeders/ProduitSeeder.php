<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Produit;

class ProduitSeeder extends Seeder
{
    public function run(): void
    {
        Produit::create([
            'nom' => 'Broxo Orabrush',
            'description' => 'Brosse à dents-gencives mécanique et sonique',
            'prix_unitaire' => 1680.00
        ]);
    }
}