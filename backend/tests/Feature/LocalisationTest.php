<?php

namespace Tests\Feature;

use App\Models\Evenement;
use App\Models\Localisation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LocalisationTest extends TestCase
{
    use RefreshDatabase;

    public function test_liste_des_localisations_est_publique(): void
    {
        Localisation::factory()->create(['libelle' => 'Plateau']);
        Localisation::factory()->create(['libelle' => 'Cocody']);

        $this->getJson('/api/localisations')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_affichage_d_une_localisation_est_public(): void
    {
        $localisation = Localisation::factory()->create(['libelle' => 'Plateau']);

        $this->getJson("/api/localisations/{$localisation->id}")
            ->assertOk()
            ->assertJson(['success' => true, 'localisation' => ['libelle' => 'Plateau']]);
    }

    public function test_creation_reservee_a_l_admin(): void
    {
        $this->postJson('/api/localisations', ['libelle' => 'Plateau'])->assertStatus(401);
    }

    public function test_admin_peut_creer_une_localisation(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/localisations', ['libelle' => 'Marcory'])
            ->assertCreated();

        $this->assertDatabaseHas('localisations', ['libelle' => 'Marcory']);
    }

    public function test_creation_refuse_un_libelle_deja_existant(): void
    {
        Sanctum::actingAs(User::factory()->create());
        Localisation::factory()->create(['libelle' => 'Plateau']);

        $this->postJson('/api/localisations', ['libelle' => 'Plateau'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['libelle']);
    }

    public function test_suppression_refusee_si_liee_a_des_evenements(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $localisation = Localisation::factory()->create(['libelle' => 'Plateau']);
        Evenement::factory()->create(['localisation_id' => $localisation->id]);

        $this->deleteJson("/api/localisations/{$localisation->id}")->assertStatus(409);
    }

    public function test_admin_peut_supprimer_une_localisation_non_liee(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $localisation = Localisation::factory()->create(['libelle' => 'Plateau']);

        $this->deleteJson("/api/localisations/{$localisation->id}")->assertOk();
        $this->assertSoftDeleted('localisations', ['id' => $localisation->id]);
    }
}
