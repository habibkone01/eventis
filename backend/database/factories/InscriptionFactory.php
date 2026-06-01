<?php

namespace Database\Factories;

use App\Models\Evenement;
use App\Models\Inscription;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class InscriptionFactory extends Factory
{
    protected $model = Inscription::class;

    public function definition(): array
    {
        return [
            'evenement_id'         => Evenement::factory(),
            'nom_participant'      => $this->faker->name(),
            'email_participant'    => $this->faker->safeEmail(),
            'token_desinscription' => Str::uuid(),
            'inscrit_le'           => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
