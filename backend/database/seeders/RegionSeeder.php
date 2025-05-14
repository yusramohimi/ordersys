<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
class RegionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          $regions = [
            'Aïn Chock',
            'Aïn Sebaâ',
            'Al Fida',
            'Anfa',
            'Ben M\'sik',
            'Hay Hassani',
            'Maârif',
            'Médiouna',
            'Mers Sultan',
            'Moulay Rachid',
            'Sidi Bernoussi',
            'Sidi Moumen',
            'Sidi Othmane',
            'Sbata',
            'Aïn Harrouda',
        ];
        foreach ($regions as $region) {
            DB::table('regions')->insert([
                'nom' => $region,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
