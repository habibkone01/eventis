<?php

namespace Tests\Unit;

use App\Http\Resources\EvenementResource;
use App\Models\Evenement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EvenementResourceTest extends TestCase
{
    use RefreshDatabase;

    public function test_les_dates_sont_formatees(): void
    {
        $evenement = Evenement::factory()->create([
            'date_debut' => '2026-12-25 20:00:00',
            'date_fin'   => '2026-12-25 23:30:00',
        ]);

        $data = (new EvenementResource($evenement))->toArray(request());

        $this->assertSame('25-12-2026 20:00', $data['date_debut']);
        $this->assertSame('25-12-2026 23:30', $data['date_fin']);
    }

    public function test_image_nulle_quand_aucune_image(): void
    {
        $evenement = Evenement::factory()->create(['image' => null]);

        $data = (new EvenementResource($evenement))->toArray(request());

        $this->assertNull($data['image']);
    }

    public function test_image_renvoie_une_url_quand_presente(): void
    {
        $evenement = Evenement::factory()->create(['image' => 'evenements/photo.jpg']);

        $data = (new EvenementResource($evenement))->toArray(request());

        $this->assertStringContainsString('storage/evenements/photo.jpg', $data['image']);
    }
}
