<?php

namespace Database\Factories;

use App\Models\StockMovement;
use App\Models\Produit;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockMovementFactory extends Factory
{
    protected $model = StockMovement::class;

    public function definition(): array
    {
        return [
            'produit_id' => Produit::inRandomOrder()->first()->id ?? Produit::factory(),
            'type' => $this->faker->randomElement(['entrée', 'sortie', 'ajustement']),
            'quantite' => $this->faker->numberBetween(1, 100),
            'motif' => $this->faker->sentence(),
        ];
    }
}
