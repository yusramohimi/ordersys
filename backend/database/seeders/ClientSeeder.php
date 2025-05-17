<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('clients')->insert([
            [
                'nom' => 'Benali',
                'prenom' => 'Ahmed',
                'telephone' => '0600123456',
                'email' => 'ahmed.benali@example.com',
                'ville' => 'Casablanca',
                'region_id' => 6, // Hay Hassani
                'adresse' => 'Rue 12, Hay Hassani',
                'password' => Hash::make('password123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'El Fassi',
                'prenom' => 'Rachid',
                'telephone' => '0600234567',
                'email' => 'rachid.fassi@example.com',
                'ville' => 'Casablanca',
                'region_id' => 7, // Maârif
                'adresse' => 'Av. Hassan II, Maârif',
                'password' => Hash::make('password123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Mouhssine',
                'prenom' => 'Youssef',
                'telephone' => '0600345678',
                'email' => 'youssef.mouhssine@example.com',
                'ville' => 'Casablanca',
                'region_id' => 11, // Sidi Bernoussi
                'adresse' => 'Rue El Qods, Sidi Bernoussi',
                'password' => Hash::make('password123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Alaoui',
                'prenom' => 'Fatima',
                'telephone' => '0600456789',
                'email' => 'fatima.alaoui@example.com',
                'ville' => 'Casablanca',
                'region_id' => 2, // Aïn Sebaâ
                'adresse' => 'Bd. Al Massira, Aïn Sebaâ',
                'password' => Hash::make('password123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Hammadi',
                'prenom' => 'Nawal',
                'telephone' => '0600567890',
                'email' => 'nawal.hammadi@example.com',
                'ville' => 'Casablanca',
                'region_id' => 10, // Moulay Rachid
                'adresse' => 'Résidence 5, Moulay Rachid',
                'password' => Hash::make('password123'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

