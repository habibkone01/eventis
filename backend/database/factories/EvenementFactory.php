<?php

namespace Database\Factories;

use App\Models\Categorie;
use App\Models\Evenement;
use App\Models\Localisation;
use App\Models\Organisateur;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Evenement>
 *
 */
class EvenementFactory extends Factory
{
    protected $model = Evenement::class;

    public function definition(): array
    {
        $dateDebut = $this->faker->dateTimeBetween('+1 day', '+6 months');
        $dateFin   = (clone $dateDebut)->modify('+2 days');

        return [
            'user_id'         => User::query()->value('id') ?? User::factory(),
            'categorie_id'    => Categorie::query()->inRandomOrder()->value('id') ?? Categorie::factory(),
            'organisateur_id' => Organisateur::query()->inRandomOrder()->value('id') ?? Organisateur::factory(),
            'localisation_id' => Localisation::query()->inRandomOrder()->value('id') ?? Localisation::factory(),
            'titre'           => $this->faker->sentence(4),
            'description'     => $this->faker->paragraph(),
            'date_debut'      => $dateDebut,
            'date_fin'        => $dateFin,
            'lieu'            => $this->faker->streetAddress(),
            'capacite_max'    => $this->faker->randomElement([50, 100, 200]),
            'statut'          => 'publie',
            'image'           => null,
        ];
    }

    /** Événement publié (dates futures). */
    public function publie(): static
    {
        return $this->state(fn () => ['statut' => 'publie']);
    }

    /** Événement annulé. */
    public function annule(): static
    {
        return $this->state(fn () => ['statut' => 'annule']);
    }

    /** Événement terminé (dates passées). */
    public function termine(): static
    {
        return $this->state(fn () => [
            'statut'     => 'termine',
            'date_debut' => now()->subDays(5),
            'date_fin'   => now()->subDays(3),
        ]);
    }
}
