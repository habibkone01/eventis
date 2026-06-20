<?php

namespace Tests\Feature;

use App\Mail\InscriptionConfirmationMail;
use App\Models\Evenement;
use App\Models\Inscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class InscriptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_inscription_publique_reussit_et_envoie_un_email(): void
    {
        Mail::fake();
        $evenement = Evenement::factory()->publie()->create(['capacite_max' => null]);

        $this->postJson('/api/inscriptions', [
            'evenement_id'      => $evenement->id,
            'nom_participant'   => 'Awa Koné',
            'email_participant' => 'awa@example.com',
        ])
            ->assertCreated()
            ->assertJson(['success' => true]);

        $inscription = Inscription::first();
        $this->assertNotNull($inscription->token_desinscription);
        Mail::assertSent(InscriptionConfirmationMail::class);
    }

    public function test_inscription_refusee_si_evenement_non_publie(): void
    {
        $evenement = Evenement::factory()->annule()->create();

        $this->postJson('/api/inscriptions', [
            'evenement_id'      => $evenement->id,
            'nom_participant'   => 'Awa Koné',
            'email_participant' => 'awa@example.com',
        ])->assertStatus(409);
    }

    public function test_inscription_refusee_si_capacite_atteinte(): void
    {
        $evenement = Evenement::factory()->publie()->create(['capacite_max' => 1]);
        Inscription::factory()->create(['evenement_id' => $evenement->id]);

        $this->postJson('/api/inscriptions', [
            'evenement_id'      => $evenement->id,
            'nom_participant'   => 'Awa Koné',
            'email_participant' => 'awa@example.com',
        ])->assertStatus(409);
    }

    public function test_inscription_refusee_si_email_deja_inscrit(): void
    {
        $evenement = Evenement::factory()->publie()->create(['capacite_max' => null]);
        Inscription::factory()->create([
            'evenement_id'      => $evenement->id,
            'email_participant' => 'awa@example.com',
        ]);

        $this->postJson('/api/inscriptions', [
            'evenement_id'      => $evenement->id,
            'nom_participant'   => 'Awa Koné',
            'email_participant' => 'awa@example.com',
        ])->assertStatus(409);
    }

    public function test_inscription_valide_les_champs(): void
    {
        $this->postJson('/api/inscriptions', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['evenement_id', 'nom_participant', 'email_participant']);
    }

    public function test_recuperation_desinscription_avec_token_valide(): void
    {
        $evenement   = Evenement::factory()->publie()->create();
        $inscription = Inscription::factory()->create(['evenement_id' => $evenement->id]);

        $this->getJson("/api/desinscription/{$inscription->token_desinscription}")
            ->assertOk()
            ->assertJson(['success' => true]);
    }

    public function test_recuperation_desinscription_avec_token_invalide_retourne_404(): void
    {
        $this->getJson('/api/desinscription/token-bidon')->assertStatus(404);
    }

    public function test_desinscription_avec_token_valide_supprime_l_inscription(): void
    {
        $evenement   = Evenement::factory()->publie()->create();
        $inscription = Inscription::factory()->create(['evenement_id' => $evenement->id]);

        $this->deleteJson("/api/desinscription/{$inscription->token_desinscription}")
            ->assertOk();

        $this->assertSoftDeleted('inscriptions', ['id' => $inscription->id]);
    }

    public function test_desinscription_refusee_si_evenement_termine_ou_annule(): void
    {
        $evenement   = Evenement::factory()->termine()->create();
        $inscription = Inscription::factory()->create(['evenement_id' => $evenement->id]);

        $this->deleteJson("/api/desinscription/{$inscription->token_desinscription}")
            ->assertStatus(409);
    }

    public function test_liste_des_inscriptions_reservee_a_l_admin(): void
    {
        $this->getJson('/api/inscriptions')->assertStatus(401);

        Sanctum::actingAs(User::factory()->create());
        $evenement = Evenement::factory()->create();
        Inscription::factory()->count(2)->create(['evenement_id' => $evenement->id]);

        $this->getJson('/api/inscriptions')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_admin_peut_supprimer_une_inscription(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $evenement   = Evenement::factory()->create();
        $inscription = Inscription::factory()->create(['evenement_id' => $evenement->id]);

        $this->deleteJson("/api/inscriptions/{$inscription->id}")->assertOk();
        $this->assertSoftDeleted('inscriptions', ['id' => $inscription->id]);
    }
}
