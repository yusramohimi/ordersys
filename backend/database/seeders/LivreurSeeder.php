<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class LivreurSeeder extends Seeder
{
    public function run(): void
    {
        $noms = [
            'Youssef El Amrani',
            'Rachid Benali',
            'Hicham Ait Taleb',
            'Anass Bouzid',
            'Soufiane El Khatib',
            'Khalid Naimi',
            'Mohamed Rahali',
            'Hamza Bakkali',
            'Othman Jabri',
            'Tariq El Idrissi',
            'Omar Tazi',
            'Amine Zerouali',
            'Mehdi Soulaimani',
            'Walid Fikri',
            'Nabil Jebari'
        ];

        foreach ($noms as $index => $nom) {
            DB::table('livreurs')->insert([
                'nom' => $nom,
                'email' => strtolower(str_replace(' ', '.', explode(' ', $nom)[0])) . ($index+1) . '@gmail.com',
                'telephone' => '06' . rand(10000000, 99999999),
                'region_id' => $index + 1,
                'password' => bcrypt('Password' . ($index + 1)),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}