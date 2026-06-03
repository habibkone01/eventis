<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Création d'une nouvelle instance du Mailable
     */
    public function __construct(public array $data) {}

    /**
     * Définit l'enveloppe de l'email (sujet, expéditeur...)
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouveau message de contact — ' . $this->data['sujet'],
        );
    }

    /**
     * Définit le contenu de l'email
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.contact',
        );
    }
}
