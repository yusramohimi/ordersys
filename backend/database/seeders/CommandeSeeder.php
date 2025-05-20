<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Client;
use App\Models\Livreur;
use App\Models\CodePromo;

class CommandeSeeder extends Seeder
{
    public function run()
    {
        DB::table('commandes')->insert([
                'client_id' => Client::inRandomOrder()->first()->id,
                'livreur_id' => Livreur::inRandomOrder()->first()->id,
                'code_promo_id' => CodePromo::inRandomOrder()->first()->id,
                'prix_total' => 5020.00,
                'statut' => 'en_livraison',
                'heure_estimee_livraison' => now()->addDays(2),
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now(),
            ],);
    }
}

