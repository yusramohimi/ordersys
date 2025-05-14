<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CodePromoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('code_promos')->insert([
            [
                'code' => 'BROXO20',
                'reduction' => 20,
                'type' => 'montant',
                'expire_le' => Carbon::now()->addDays(30),
                'utilisations_max' => 100,
                'utilisations_actuelles' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'WELCOME10',
                'reduction' => 10,
                'type' => 'pourcentage',
                'expire_le' => Carbon::now()->addDays(60),
                'utilisations_max' => 200,
                'utilisations_actuelles' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
