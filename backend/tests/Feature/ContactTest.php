<?php

namespace Tests\Feature;

use App\Mail\ContactMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    public function test_envoi_d_un_message_de_contact(): void
    {
        Mail::fake();

        $this->postJson('/api/contact', [
            'nom'     => 'Awa Koné',
            'email'   => 'awa@example.com',
            'sujet'   => 'Demande d\'information',
            'message' => 'Bonjour, je souhaite des renseignements.',
        ])
            ->assertOk()
            ->assertJson(['success' => true]);

        Mail::assertSent(ContactMail::class, function (ContactMail $mail) {
            return $mail->hasTo(config('mail.from.address'));
        });
    }

    public function test_validation_du_formulaire_de_contact(): void
    {
        $this->postJson('/api/contact', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['nom', 'email', 'sujet', 'message']);
    }
}
