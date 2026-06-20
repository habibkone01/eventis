<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Localisation>
 *
 */
class LocalisationFactory extends Factory
{
    protected static int $sequence = 0;

    public function definition(): array
    {
        $libelles = [
            'Plateau', 'Cocody', 'Marcory', 'Treichville',
            'Adjamé', 'Abobo', 'Yopougon', 'Koumassi',
            'Port-Bouët', 'Attécoubé',
        ];

        static::$sequence++;
        $base = $libelles[(static::$sequence - 1) % count($libelles)];

        return [
            'libelle' => $base . ' ' . static::$sequence,
        ];
    }
}
