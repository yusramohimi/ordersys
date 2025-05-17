<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('admins')->insert([
            [
                'nom' => 'Bouchra El Badaoui',
                'email' => 'elbbushra@gmail.com',
                'password' => Hash::make('bushra123'), 
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Yousra Mohimi',
                'email' => 'yuusramohimi@gmail.com',
                'password' => Hash::make('yusra123'), 
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
        ]);
    }
}
