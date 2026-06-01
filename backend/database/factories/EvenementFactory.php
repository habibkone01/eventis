<?php

namespace Database\Factories;

use App\Models\Categorie;
use App\Models\Evenement;
use App\Models\Localisation;
use App\Models\Organisateur;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EvenementFactory extends Factory
{
    protected $model = Evenement::class;

    public function definition(): array
    {
        $dateDebut = $this->faker->dateTimeBetween('now', '+6 months');
        $dateFin   = $this->faker->dateTimeBetween($dateDebut, '+1 week');

        return [
            'user_id'          => User::factory(),
            'categorie_id'     => Categorie::factory(),
            'organisateur_id'  => Organisateur::factory(),
            'localisation_id'  => Localisation::factory(),
            'titre'            => $this->faker->sentence(4),
            'description'      => $this->faker->paragraphs(3, true),
            'date_debut'       => $dateDebut,
            'date_fin'         => $dateFin,
            'lieu'             => $this->faker->address(),
            'capacite_max'     => $this->faker->randomElement([50, 100, 200, 300, 500]),
            'statut'           => $this->faker->randomElement(['publie', 'brouillon', 'annule']),
            'image_url'        => null,
        ];
    }
}
