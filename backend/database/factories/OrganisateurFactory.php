<?php

namespace Database\Factories;

use App\Models\Organisateur;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrganisateurFactory extends Factory
{
    protected $model = Organisateur::class;

    public function definition(): array
    {
        return [
            'nom'         => $this->faker->company(),
            'email'       => $this->faker->unique()->safeEmail(),
            'telephone'   => $this->faker->phoneNumber(),
            'description' => $this->faker->paragraph(),
        ];
    }
}
