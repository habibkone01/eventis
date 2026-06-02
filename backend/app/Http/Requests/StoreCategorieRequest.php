<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreCategorieRequest extends FormRequest
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
            'libelle' => 'required|string|max:255|unique:categories,libelle',
            'description' => 'nullable|string',
            'slug' => 'required|string|max:255|unique:categories,slug',
            'icone' => 'nullable|string',
        ];
    }

    /**
     * Retourne les messages d'erreur personnalisés.
     */
    public function messages(): array
    {
        return [
            'libelle.required' => 'Le libellé est obligatoire.',
            'libelle.unique' => 'Ce libellé existe déjà.',
            'libelle.max' => 'Le libellé ne doit pas dépasser 255 caractères.',
            'slug.required' => 'Le slug est obligatoire.',
            'slug.unique' => 'Ce slug existe déjà.',
            'slug.max' => 'Le slug ne doit pas dépasser 255 caractères.',
            'icone.string' => 'L\'icône doit être une chaîne de caractères.',
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
