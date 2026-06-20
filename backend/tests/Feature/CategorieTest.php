<?php

namespace Tests\Feature;

use App\Models\Categorie;
use App\Models\Evenement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CategorieTest extends TestCase
{
    use RefreshDatabase;

    public function test_liste_des_categories_est_publique(): void
    {
        Categorie::factory()->create(['libelle' => 'Sport']);
        Categorie::factory()->create(['libelle' => 'Musique']);

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_affichage_d_une_categorie_est_public(): void
    {
        $categorie = Categorie::factory()->create(['libelle' => 'Sport']);

        $this->getJson("/api/categories/{$categorie->id}")
            ->assertOk()
            ->assertJson(['success' => true, 'categorie' => ['libelle' => 'Sport']]);
    }

    public function test_creation_reservee_a_l_admin(): void
    {
        $this->postJson('/api/categories', ['libelle' => 'Sport'])->assertStatus(401);
    }

    public function test_admin_peut_creer_une_categorie(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/categories', ['libelle' => 'Gastronomie'])
            ->assertCreated()
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('categories', ['libelle' => 'Gastronomie']);
    }

    public function test_creation_refuse_un_libelle_deja_existant(): void
    {
        Sanctum::actingAs(User::factory()->create());
        Categorie::factory()->create(['libelle' => 'Sport']);

        $this->postJson('/api/categories', ['libelle' => 'Sport'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['libelle']);
    }

    public function test_modification_autorise_le_meme_libelle_sur_soi_meme(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $categorie = Categorie::factory()->create(['libelle' => 'Sport']);

        $this->putJson("/api/categories/{$categorie->id}", ['libelle' => 'Sport'])
            ->assertOk();
    }

    public function test_modification_refuse_un_libelle_pris_par_une_autre(): void
    {
        Sanctum::actingAs(User::factory()->create());
        Categorie::factory()->create(['libelle' => 'Sport']);
        $autre = Categorie::factory()->create(['libelle' => 'Musique']);

        $this->putJson("/api/categories/{$autre->id}", ['libelle' => 'Sport'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['libelle']);
    }

    public function test_suppression_refusee_si_categorie_liee_a_des_evenements(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $categorie = Categorie::factory()->create(['libelle' => 'Sport']);
        Evenement::factory()->create(['categorie_id' => $categorie->id]);

        $this->deleteJson("/api/categories/{$categorie->id}")->assertStatus(409);
    }

    public function test_admin_peut_supprimer_une_categorie_non_liee(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $categorie = Categorie::factory()->create(['libelle' => 'Sport']);

        $this->deleteJson("/api/categories/{$categorie->id}")->assertOk();
        $this->assertSoftDeleted('categories', ['id' => $categorie->id]);
    }
}
