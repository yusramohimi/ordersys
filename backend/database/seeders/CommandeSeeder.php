<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CommandeSeeder extends Seeder
{
    public function run()
    {
        DB::table('commandes')->insert([
                'client_id' => 2,
                'livreur_id' => 3,
                'code_promo_id' => 1,
                'prix_total' => 89.99,
                'statut' => 'en_livraison',
                'heure_estimee_livraison' => Carbon::now()->addDays(2),
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now(),
            ],);
    }
}

