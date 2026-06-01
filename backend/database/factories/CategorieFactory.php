<?php

namespace Database\Factories;

use App\Models\Categorie;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategorieFactory extends Factory
{
    protected $model = Categorie::class;

    public function definition(): array
    {
        $libelles = [
            'Musique', 'Culture', 'Sport', 'Business',
            'Formation', 'Gastronomie', 'Technologie', 'Art'
        ];

        $libelle = $this->faker->unique()->randomElement($libelles);

        return [
            'libelle'     => $libelle,
            'description' => $this->faker->sentence(),
            'slug'        => Str::slug($libelle),
            'icone'       => $this->faker->randomElement([
                'Music', 'Trophy', 'Building2', 'Briefcase',
                'GraduationCap', 'Utensils', 'Cpu', 'Palette'
            ]),
        ];
    }
}
