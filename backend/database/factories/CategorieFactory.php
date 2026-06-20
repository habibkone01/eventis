<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Categorie>
 *
 */
class CategorieFactory extends Factory
{
    protected static int $sequence = 0;

    public function definition(): array
    {
        $libelles = [
            'Musique', 'Culture', 'Sport', 'Business',
            'Formation', 'Gastronomie', 'Technologie', 'Art',
        ];

        static::$sequence++;
        $base = $libelles[(static::$sequence - 1) % count($libelles)];

        return [
            'libelle' => $base . ' ' . static::$sequence,
        ];
    }
}
