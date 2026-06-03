<?php

namespace App\Mail;

use App\Models\Inscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InscriptionConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Création d'une nouvelle instance du Mailable
     */
    public function __construct(public Inscription $inscription) {}

    /**
     * Définit l'enveloppe de l'email (sujet, expéditeur...)
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmation d\'inscription — ' . $this->inscription->evenement->titre,
        );
    }

    /**
     * Définit le contenu de l'email
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.inscription_confirmation',
        );
    }
}
