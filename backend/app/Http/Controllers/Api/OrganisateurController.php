<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrganisateurRequest;
use App\Http\Requests\UpdateOrganisateurRequest;
use App\Http\Resources\OrganisateurResource;
use App\Models\Organisateur;
use Illuminate\Http\Request;

class OrganisateurController extends Controller
{
    /**
     * Liste de tous les organisateurs
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $organisateurs = Organisateur::orderBy('created_at', 'desc')->paginate($perPage);

        return OrganisateurResource::collection($organisateurs);
    }

    /**
     * Voir un organisateur
     */
    public function show($id)
    {
        $organisateur = Organisateur::findOrFail($id);

        return response()->json([
            'success' => true,
            'organisateur' => new OrganisateurResource($organisateur),
        ], 200);
    }

    /**
     * Créer un organisateur
     */
    public function store(StoreOrganisateurRequest $request)
    {
        $organisateur = Organisateur::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Organisateur créé avec succès',
            'organisateur' => new OrganisateurResource($organisateur),
        ], 201);
    }

    /**
     * Modifier un organisateur
     */
    public function update(UpdateOrganisateurRequest $request, $id)
    {
        $organisateur = Organisateur::findOrFail($id);
        $organisateur->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Organisateur mis à jour avec succès',
            'organisateur' => new OrganisateurResource($organisateur),
        ], 200);
    }

    /**
     * Supprimer un organisateur
     */
    public function destroy($id)
    {
        $organisateur = Organisateur::findOrFail($id);

        if ($organisateur->evenements()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer cet organisateur car il est lié à des événements.',
            ], 409);
        }

        $organisateur->delete();

        return response()->json([
            'success' => true,
            'message' => 'Organisateur supprimé avec succès',
        ], 200);
    }
}
