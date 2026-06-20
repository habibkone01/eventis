<?php

namespace Tests\Unit;

use App\Models\Categorie;
use App\Models\Evenement;
use App\Models\Inscription;
use App\Models\Localisation;
use App\Models\Organisateur;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

/**
 * Tests centrés sur le modèle Evenement (relations, casts, soft deletes).
 */
class EvenementModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_evenement_appartient_a_ses_referentiels(): void
    {
        $evenement = Evenement::factory()->create();

        $this->assertInstanceOf(User::class, $evenement->user);
        $this->assertInstanceOf(Categorie::class, $evenement->categorie);
        $this->assertInstanceOf(Organisateur::class, $evenement->organisateur);
        $this->assertInstanceOf(Localisation::class, $evenement->localisation);
    }

    public function test_un_evenement_a_plusieurs_inscriptions(): void
    {
        $evenement = Evenement::factory()->create();
        Inscription::factory()->count(3)->create(['evenement_id' => $evenement->id]);

        $this->assertInstanceOf(Collection::class, $evenement->inscriptions);
        $this->assertCount(3, $evenement->inscriptions);
    }

    public function test_les_dates_sont_castees_en_carbon(): void
    {
        $evenement = Evenement::factory()->create();

        $this->assertInstanceOf(Carbon::class, $evenement->date_debut);
        $this->assertInstanceOf(Carbon::class, $evenement->date_fin);
    }

    public function test_la_suppression_est_un_soft_delete(): void
    {
        $evenement = Evenement::factory()->create();
        $evenement->delete();

        $this->assertSoftDeleted($evenement);
        $this->assertNotNull(Evenement::withTrashed()->find($evenement->id));
    }

    public function test_un_referentiel_soft_delete_reste_accessible_via_l_evenement(): void
    {
        $evenement = Evenement::factory()->create();
        $categorie = $evenement->categorie;
        $categorie->delete();

        // La relation est définie avec withTrashed() : elle doit rester lisible.
        $this->assertNotNull($evenement->fresh()->categorie);
    }
}
