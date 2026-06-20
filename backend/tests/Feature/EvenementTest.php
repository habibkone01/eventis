<?php

namespace Tests\Feature;

use App\Mail\EvenementAnnuleMail;
use App\Models\Categorie;
use App\Models\Evenement;
use App\Models\Inscription;
use App\Models\Localisation;
use App\Models\Organisateur;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EvenementTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin(): User
    {
        $admin = User::factory()->create();
        Sanctum::actingAs($admin);

        return $admin;
    }

    /** Construit un jeu de référentiels valides et renvoie un payload prêt à poster. */
    private function payloadEvenement(array $overrides = []): array
    {
        return array_merge([
            'categorie_id'    => Categorie::factory()->create()->id,
            'organisateur_id' => Organisateur::factory()->create()->id,
            'localisation_id' => Localisation::factory()->create()->id,
            'titre'           => 'Concert de fin d\'année',
            'description'     => 'Un grand concert.',
            'date_debut'      => now()->addWeek()->format('Y-m-d H:i:s'),
            'date_fin'        => now()->addWeek()->addHours(3)->format('Y-m-d H:i:s'),
            'capacite_max'    => 100,
        ], $overrides);
    }


    public function test_index_est_public_et_pagine(): void
    {
        Evenement::factory()->count(3)->create();

        $this->getJson('/api/evenements')
            ->assertOk()
            ->assertJsonStructure(['data', 'links', 'meta'])
            ->assertJsonCount(3, 'data');
    }

    public function test_index_filtre_par_statut(): void
    {
        Evenement::factory()->publie()->count(2)->create();
        Evenement::factory()->annule()->count(1)->create();

        $this->getJson('/api/evenements?statut=annule')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_index_passe_automatiquement_les_evenements_termines(): void
    {
        $evenement = Evenement::factory()->create([
            'statut'     => 'publie',
            'date_debut' => now()->subDays(5),
            'date_fin'   => now()->subDay(),
        ]);

        $this->getJson('/api/evenements')->assertOk();

        $this->assertDatabaseHas('evenements', [
            'id'     => $evenement->id,
            'statut' => 'termine',
        ]);
    }

    public function test_show_retourne_un_evenement_existant(): void
    {
        $evenement = Evenement::factory()->create();

        $this->getJson("/api/evenements/{$evenement->id}")
            ->assertOk()
            ->assertJson(['success' => true, 'evenement' => ['id' => $evenement->id]]);
    }

    public function test_show_retourne_404_si_inexistant(): void
    {
        $this->getJson('/api/evenements/999999')->assertStatus(404);
    }


    public function test_admin_peut_creer_un_evenement_avec_image(): void
    {
        Storage::fake('public');
        $admin = $this->actingAsAdmin();

        $payload = $this->payloadEvenement([
            'image' => UploadedFile::fake()->image('event.jpg'),
        ]);

        $this->post('/api/evenements', $payload, ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJson(['success' => true]);

        $evenement = Evenement::first();
        $this->assertSame('publie', $evenement->statut);
        $this->assertSame($admin->id, $evenement->user_id);
        $this->assertNotNull($evenement->image);
        Storage::disk('public')->assertExists($evenement->image);
    }

    public function test_creation_refuse_une_date_de_debut_dans_le_passe(): void
    {
        $this->actingAsAdmin();

        $payload = $this->payloadEvenement([
            'date_debut' => now()->subDay()->format('Y-m-d H:i:s'),
            'date_fin'   => null,
        ]);

        $this->postJson('/api/evenements', $payload)->assertStatus(422);
    }

    public function test_creation_valide_les_champs_obligatoires(): void
    {
        $this->actingAsAdmin();

        $this->postJson('/api/evenements', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'categorie_id', 'organisateur_id', 'localisation_id', 'titre', 'date_debut',
            ]);
    }

    public function test_creation_refusee_sans_authentification(): void
    {
        $this->postJson('/api/evenements', [])->assertStatus(401);
    }


    public function test_modification_refusee_sur_evenement_termine(): void
    {
        $this->actingAsAdmin();
        $evenement = Evenement::factory()->termine()->create();

        $payload = $this->payloadEvenement([
            'categorie_id'    => $evenement->categorie_id,
            'organisateur_id' => $evenement->organisateur_id,
            'localisation_id' => $evenement->localisation_id,
        ]);

        $this->putJson("/api/evenements/{$evenement->id}", $payload)->assertStatus(409);
    }

    public function test_modification_refuse_le_passage_manuel_a_termine(): void
    {
        $this->actingAsAdmin();
        $evenement = Evenement::factory()->publie()->create();

        $payload = $this->payloadEvenement([
            'categorie_id'    => $evenement->categorie_id,
            'organisateur_id' => $evenement->organisateur_id,
            'localisation_id' => $evenement->localisation_id,
            'statut'          => 'termine',
        ]);

        $this->putJson("/api/evenements/{$evenement->id}", $payload)->assertStatus(409);
    }

    public function test_modification_refuse_de_republier_un_evenement_annule(): void
    {
        $this->actingAsAdmin();
        $evenement = Evenement::factory()->annule()->create();

        $payload = $this->payloadEvenement([
            'categorie_id'    => $evenement->categorie_id,
            'organisateur_id' => $evenement->organisateur_id,
            'localisation_id' => $evenement->localisation_id,
            'statut'          => 'publie',
        ]);

        $this->putJson("/api/evenements/{$evenement->id}", $payload)->assertStatus(409);
    }


    public function test_annuler_passe_le_statut_a_annule_et_notifie_les_inscrits(): void
    {
        Mail::fake();
        $this->actingAsAdmin();

        $evenement = Evenement::factory()->publie()->create();
        Inscription::factory()->count(2)->create(['evenement_id' => $evenement->id]);

        $this->patchJson("/api/evenements/{$evenement->id}/annuler")
            ->assertOk()
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('evenements', ['id' => $evenement->id, 'statut' => 'annule']);
        Mail::assertSent(EvenementAnnuleMail::class, 2);
    }

    public function test_annuler_refuse_un_evenement_deja_annule(): void
    {
        $this->actingAsAdmin();
        $evenement = Evenement::factory()->annule()->create();

        $this->patchJson("/api/evenements/{$evenement->id}/annuler")->assertStatus(409);
    }

    public function test_annuler_refuse_un_evenement_termine(): void
    {
        $this->actingAsAdmin();
        $evenement = Evenement::factory()->termine()->create();

        $this->patchJson("/api/evenements/{$evenement->id}/annuler")->assertStatus(409);
    }


    public function test_suppression_refusee_sur_evenement_publie(): void
    {
        $this->actingAsAdmin();
        $evenement = Evenement::factory()->publie()->create();

        $this->deleteJson("/api/evenements/{$evenement->id}")->assertStatus(409);
    }

    public function test_suppression_refusee_si_l_evenement_a_des_inscriptions(): void
    {
        $this->actingAsAdmin();
        $evenement = Evenement::factory()->annule()->create();
        Inscription::factory()->create(['evenement_id' => $evenement->id]);

        $this->deleteJson("/api/evenements/{$evenement->id}")->assertStatus(409);
    }

    public function test_suppression_ok_supprime_l_image_et_soft_delete(): void
    {
        Storage::fake('public');
        $this->actingAsAdmin();

        Storage::disk('public')->put('evenements/test.jpg', 'contenu');
        $evenement = Evenement::factory()->annule()->create(['image' => 'evenements/test.jpg']);

        $this->deleteJson("/api/evenements/{$evenement->id}")->assertOk();

        $this->assertSoftDeleted('evenements', ['id' => $evenement->id]);
        Storage::disk('public')->assertMissing('evenements/test.jpg');
    }
}
