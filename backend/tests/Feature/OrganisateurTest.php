<?php

namespace Tests\Feature;

use App\Models\Evenement;
use App\Models\Organisateur;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrganisateurTest extends TestCase
{
    use RefreshDatabase;

    public function test_la_liste_des_organisateurs_est_reservee_a_l_admin(): void
    {
        $this->getJson('/api/organisateurs')->assertStatus(401);

        Sanctum::actingAs(User::factory()->create());
        Organisateur::factory()->count(2)->create();

        $this->getJson('/api/organisateurs')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_admin_peut_creer_un_organisateur(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/organisateurs', [
            'nom'   => 'Eventis Prod',
            'email' => 'contact@eventisprod.ci',
        ])
            ->assertCreated();

        $this->assertDatabaseHas('organisateurs', ['email' => 'contact@eventisprod.ci']);
    }

    public function test_creation_refuse_un_email_deja_utilise(): void
    {
        Sanctum::actingAs(User::factory()->create());
        Organisateur::factory()->create(['email' => 'contact@eventisprod.ci']);

        $this->postJson('/api/organisateurs', [
            'nom'   => 'Autre Prod',
            'email' => 'contact@eventisprod.ci',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_suppression_refusee_si_lie_a_des_evenements(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $organisateur = Organisateur::factory()->create();
        Evenement::factory()->create(['organisateur_id' => $organisateur->id]);

        $this->deleteJson("/api/organisateurs/{$organisateur->id}")->assertStatus(409);
    }

    public function test_admin_peut_supprimer_un_organisateur_non_lie(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $organisateur = Organisateur::factory()->create();

        $this->deleteJson("/api/organisateurs/{$organisateur->id}")->assertOk();
        $this->assertSoftDeleted('organisateurs', ['id' => $organisateur->id]);
    }
}
