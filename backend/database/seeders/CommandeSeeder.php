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
        $clients = Client::pluck('id')->toArray();
        $livreurs = Livreur::pluck('id')->toArray();
        $codesPromo = CodePromo::pluck('id')->toArray();

        for ($i = 0; $i < 10; $i++) {
            DB::table('commandes')->insert([
                'client_id' => $clients[array_rand($clients)],
                'livreur_id' => $livreurs[array_rand($livreurs)],
                'code_promo_id' => $codesPromo[array_rand($codesPromo)],
                'prix_total' => rand(100, 10000),
                'statut' => collect(['en_attente','confirmee','en_cours','livree','retour','annulee'])->random(),
                'heure_estimee_livraison' => now()->addDays(rand(1, 5)),
                'created_at' => Carbon::now()->subDays(rand(1, 5)),
                'updated_at' => now(),
            ]);
        }
    }
}

