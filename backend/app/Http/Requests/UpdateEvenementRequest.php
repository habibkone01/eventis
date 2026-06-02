<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateEvenementRequest extends FormRequest
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
            'categorie_id' => 'required|exists:categories,id',
            'organisateur_id' => 'required|exists:organisateurs,id',
            'localisation_id' => 'required|exists:localisations,id',
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after:date_debut',
            'lieu' => 'nullable|string|max:255',
            'capacite_max' => 'nullable|integer|min:1',
            'statut' => 'required|in:publie,annule,termine',
            'image_url' => 'nullable|string'
        ];
    }

    /**
     * Retourne les messages d'erreur personnalisés.
     */
    public function messages(): array
    {
        return [
            'categorie_id.required' => 'La catégorie est obligatoire.',
            'categorie_id.exists' => 'La catégorie sélectionnée n\'existe pas.',
            'organisateur_id.required' => 'L\'organisateur est obligatoire.',
            'organisateur_id.exists' => 'L\'organisateur sélectionné n\'existe pas.',
            'localisation_id.required' => 'La localisation est obligatoire.',
            'localisation_id.exists' => 'La localisation sélectionnée n\'existe pas.',
            'titre.required' => 'Le titre est obligatoire.',
            'titre.max' => 'Le titre ne doit pas dépasser 255 caractères.',
            'date_debut.required' => 'La date de début est obligatoire.',
            'date_debut.date' => 'La date de début n\'est pas valide.',
            'date_fin.date' => 'La date de fin n\'est pas valide.',
            'date_fin.after' => 'La date de fin doit être après la date de début.',
            'capacite_max.integer' => 'La capacité doit être un nombre entier.',
            'capacite_max.min' => 'La capacité doit être au moins 1.',
            'statut.required' => 'Le statut est obligatoire.',
            'statut.in' => 'Le statut doit être publie, annule ou termine.'
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
