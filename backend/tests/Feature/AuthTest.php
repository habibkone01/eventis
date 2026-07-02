<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_avec_identifiants_valides_retourne_un_token(): void
    {
        User::factory()->create([
            'email'    => 'admin@eventis.ci',
            'password' => 'admin@12',
        ]);

        $this->postJson('/api/login', [
            'email'    => 'admin@eventis.ci',
            'password' => 'admin@12',
        ])
            ->assertOk()
            ->assertJson(['success' => true])
            ->assertJsonStructure(['success', 'message', 'token', 'user' => ['id', 'email']]);
    }

    public function test_login_avec_mauvais_mot_de_passe_retourne_401(): void
    {
        User::factory()->create([
            'email'    => 'admin@eventis.ci',
            'password' => 'admin@12',
        ]);

        $this->postJson('/api/login', [
            'email'    => 'admin@eventis.ci',
            'password' => 'mauvais-mot-de-passe',
        ])
            ->assertStatus(401)
            ->assertJson(['success' => false]);
    }

    public function test_login_valide_les_champs(): void
    {
        $this->postJson('/api/login', [
            'email'    => 'pas-un-email',
            'password' => '123',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_logout_supprime_le_token_courant(): void
    {
        $user  = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/logout')
            ->assertOk()
            ->assertJson(['success' => true]);

        $this->assertCount(0, $user->fresh()->tokens);
    }

    public function test_me_retourne_l_utilisateur_connecte(): void
    {
        $user = User::factory()->create(['email' => 'admin@eventis.ci']);
        Sanctum::actingAs($user);

        $this->getJson('/api/me')
            ->assertOk()
            ->assertJson(['success' => true, 'user' => ['email' => 'admin@eventis.ci']]);
    }

    public function test_une_route_protegee_refuse_l_acces_sans_token(): void
    {
        $this->postJson('/api/evenements', [])->assertStatus(401);
        $this->getJson('/api/me')->assertStatus(401);
        $this->getJson('/api/inscriptions')->assertStatus(401);
    }
    public function test_echec_volontaire(): void
    {
        $this->assertTrue(false);
    }
}
