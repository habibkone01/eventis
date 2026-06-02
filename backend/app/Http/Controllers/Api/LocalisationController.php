<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLocalisationRequest;
use App\Http\Requests\UpdateLocalisationRequest;
use App\Http\Resources\LocalisationResource;
use App\Models\Localisation;
use Illuminate\Http\Request;

class LocalisationController extends Controller
{
    /**
     * Liste de toutes les localisations
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $localisations = Localisation::orderBy('libelle', 'asc')->paginate($perPage);

        return LocalisationResource::collection($localisations);
    }

    /**
     * Voir une localisation
     */
    public function show($id)
    {
        $localisation = Localisation::findOrFail($id);

        return response()->json([
            'success' => true,
            'localisation' => new LocalisationResource($localisation),
        ], 200);
    }

    /**
     * Créer une localisation
     */
    public function store(StoreLocalisationRequest $request)
    {
        $localisation = Localisation::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Localisation créée avec succès',
            'localisation' => new LocalisationResource($localisation),
        ], 201);
    }

    /**
     * Modifier une localisation
     */
    public function update(UpdateLocalisationRequest $request, $id)
    {
        $localisation = Localisation::findOrFail($id);
        $localisation->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Localisation mise à jour avec succès',
            'localisation' => new LocalisationResource($localisation),
        ], 200);
    }

    /**
     * Supprimer une localisation
     */
    public function destroy($id)
    {
        $localisation = Localisation::findOrFail($id);

        if ($localisation->evenements()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer cette localisation car elle est liée à des événements.',
            ], 409);
        }

        $localisation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Localisation supprimée avec succès',
        ], 200);
    }
}
