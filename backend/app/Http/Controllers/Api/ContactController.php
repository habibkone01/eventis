<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Mail\ContactMail;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    /**
     * Envoyer un message de contact
     */
    public function store(StoreContactRequest $request)
    {
        try {
            Mail::to(config('mail.from.address'))->send(new ContactMail($request->validated()));
        } catch (\Exception) {}

        return response()->json([
            'success' => true,
            'message' => 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.',
        ], 200);
    }
}
