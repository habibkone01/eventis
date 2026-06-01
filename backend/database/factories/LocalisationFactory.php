<?php

namespace Database\Factories;

use App\Models\Localisation;
use Illuminate\Database\Eloquent\Factories\Factory;

class LocalisationFactory extends Factory
{
    protected $model = Localisation::class;

    public function definition(): array
    {
        $libelles = [
            'Plateau', 'Cocody', 'Marcory', 'Treichville',
            'Adjamé', 'Abobo', 'Yopougon', 'Koumassi',
            'Port-Bouët', 'Attécoubé'
        ];

        return [
            'libelle' => $this->faker->unique()->randomElement($libelles),
        ];
    }
}
