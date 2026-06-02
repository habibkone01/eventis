<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategorieRequest;
use App\Http\Requests\UpdateCategorieRequest;
use App\Http\Resources\CategorieResource;
use App\Models\Categorie;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    /**
     * Liste de toutes les catégories
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $categories = Categorie::orderBy('created_at', 'desc')->paginate($perPage);

        return CategorieResource::collection($categories);
    }

    /**
     * Voir une catégorie
     */
    public function show($id)
    {
        $categorie = Categorie::findOrFail($id);

        return response()->json([
            'success' => true,
            'categorie' => new CategorieResource($categorie),
        ], 200);
    }

    /**
     * Créer une catégorie
     */
    public function store(StoreCategorieRequest $request)
    {
        $categorie = Categorie::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Catégorie créée avec succès',
            'categorie' => new CategorieResource($categorie),
        ], 201);
    }

    /**
     * Modifier une catégorie
     */
    public function update(UpdateCategorieRequest $request, $id)
    {
        $categorie = Categorie::findOrFail($id);
        $categorie->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Catégorie mise à jour avec succès',
            'categorie' => new CategorieResource($categorie),
        ], 200);
    }

    /**
     * Supprimer une catégorie
     */
    public function destroy($id)
    {
        $categorie = Categorie::findOrFail($id);

        if ($categorie->evenements()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer cette catégorie car elle est liée à des événements.',
            ], 409);
        }

        $categorie->delete();

        return response()->json([
            'success' => true,
            'message' => 'Catégorie supprimée avec succès',
        ], 200);
    }
}
