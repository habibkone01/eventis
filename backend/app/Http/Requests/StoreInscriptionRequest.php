<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreInscriptionRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Retourne les règles de validation applicables à la requête.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'evenement_id' => 'required|exists:evenements,id',
            'nom_participant' => 'required|string|max:255',
            'email_participant' => 'required|string|email',
        ];
    }

    /**
     * Retourne les messages d'erreur personnalisés.
     */
    public function messages(): array
    {
        return [
            'evenement_id.required' => 'L\'événement est obligatoire.',
            'evenement_id.exists' => 'L\'événement sélectionné n\'existe pas.',
            'nom_participant.required' => 'Le nom du participant est obligatoire.',
            'nom_participant.max' => 'Le nom ne doit pas dépasser 255 caractères.',
            'email_participant.required' => 'L\'email du participant est obligatoire.',
            'email_participant.email' => 'L\'email du participant n\'est pas valide.',
        ];
    }

    /**
     * Gère une tentative de validation échouée.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Erreur de validation',
            'errors' => $validator->errors()
        ], 422));
    }
}
