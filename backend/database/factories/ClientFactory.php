<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'nom' => $this->faker->lastName,
            'prenom' => $this->faker->firstName,
            'telephone' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->safeEmail,
            'ville' => $this->faker->city,
            'region_id' => rand(1, 15), // régions de 1 à 15
            'adresse' => $this->faker->address,
            'password' => bcrypt('password'), // mot de passe fixe pour tous
        ];
    }
}
