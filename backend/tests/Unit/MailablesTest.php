<?php

namespace Tests\Unit;

use App\Mail\ContactMail;
use App\Mail\EvenementAnnuleMail;
use App\Mail\InscriptionConfirmationMail;
use App\Models\Evenement;
use App\Models\Inscription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MailablesTest extends TestCase
{
    use RefreshDatabase;

    public function test_mail_de_confirmation_d_inscription(): void
    {
        $evenement   = Evenement::factory()->create(['titre' => 'Concert Reggae']);
        $inscription = Inscription::factory()->create(['evenement_id' => $evenement->id]);

        $mail = new InscriptionConfirmationMail($inscription->load('evenement'));

        $this->assertStringContainsString('Concert Reggae', $mail->envelope()->subject);
        $this->assertSame('emails.inscription_confirmation', $mail->content()->view);
    }

    public function test_mail_d_annulation_d_evenement(): void
    {
        $evenement   = Evenement::factory()->create(['titre' => 'Gala Annuel']);
        $inscription = Inscription::factory()->create(['evenement_id' => $evenement->id]);

        $mail = new EvenementAnnuleMail($evenement, $inscription);

        $this->assertStringContainsString('Gala Annuel', $mail->envelope()->subject);
        $this->assertSame('emails.evenement_annule', $mail->content()->view);
    }

    public function test_mail_de_contact(): void
    {
        $mail = new ContactMail([
            'nom'     => 'Awa Koné',
            'email'   => 'awa@example.com',
            'sujet'   => 'Partenariat',
            'message' => 'Bonjour.',
        ]);

        $this->assertStringContainsString('Partenariat', $mail->envelope()->subject);
        $this->assertSame('emails.contact', $mail->content()->view);
    }
}
