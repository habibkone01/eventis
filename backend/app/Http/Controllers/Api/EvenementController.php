<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEvenementRequest;
use App\Http\Requests\UpdateEvenementRequest;
use App\Http\Resources\EvenementResource;
use App\Models\Evenement;
use Carbon\Carbon;
use Illuminate\Http\Request;

class EvenementController extends Controller
{
    /**
     * Liste des événements avec filtres
     */
    public function index(Request $request)
    {
        // Passer automatiquement les événements terminés au statut termine
        Evenement::where('statut', 'publie')
            ->whereNotNull('date_fin')
            ->where('date_fin', '<', now())
            ->update(['statut' => 'termine']);

        $perPage = $request->query('per_page', 12);
        $evenements = Evenement::with(['categorie', 'localisation', 'organisateur'])
            ->when($request->statut, function ($query) use ($request) {
                $query->where('statut', $request->statut);
            })
            ->when($request->categorie_id, function ($query) use ($request) {
                $query->where('categorie_id', $request->categorie_id);
            })
            ->when($request->localisation_id, function ($query) use ($request) {
                $query->where('localisation_id', $request->localisation_id);
            })
            ->when($request->date_debut, function ($query) use ($request) {
                $query->where('date_debut', '>=', $request->date_debut);
            })
            ->when($request->search, function ($query) use ($request) {
                $query->where('titre', 'like', '%' . $request->search . '%');
            })
            ->orderBy('date_debut', 'asc')
            ->paginate($perPage);

        return EvenementResource::collection($evenements);
    }

    /**
     * Voir un événement
     */
    public function show($id)
    {
        $evenement = Evenement::with(['categorie', 'localisation', 'organisateur'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'evenement' => new EvenementResource($evenement),
        ], 200);
    }

    /**
     * Créer un événement
     */
    public function store(StoreEvenementRequest $request)
    {
        // Vérifier que la date de début n'est pas dans le passé
        if (Carbon::parse($request->date_debut)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'La date de début ne peut pas être dans le passé.',
            ], 422);
        }

        $evenement = Evenement::create(array_merge(
            $request->validated(),
            ['user_id' => $request->user()->id]
        ));

        return response()->json([
            'success' => true,
            'message' => 'Événement créé avec succès',
            'evenement' => new EvenementResource($evenement->load(['categorie', 'localisation', 'organisateur'])),
        ], 201);
    }

    /**
     * Modifier un événement
     */
    public function update(UpdateEvenementRequest $request, $id)
    {
        $evenement = Evenement::findOrFail($id);

        // Impossible de modifier un événement terminé
        if ($evenement->statut === 'termine') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de modifier un événement terminé.',
            ], 409);
        }

        // Impossible de passer à termine manuellement
        if ($request->statut === 'termine') {
            return response()->json([
                'success' => false,
                'message' => 'Le statut terminé est géré automatiquement.',
            ], 409);
        }

        // Impossible de repasser de annule à publie
        if ($evenement->statut === 'annule' && $request->statut === 'publie') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de republier un événement annulé.',
            ], 409);
        }

        $evenement->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Événement mis à jour avec succès',
            'evenement' => new EvenementResource($evenement->load(['categorie', 'localisation', 'organisateur'])),
        ], 200);
    }

    /**
     * Annuler un événement
     */
    public function annuler($id)
    {
        $evenement = Evenement::findOrFail($id);

        // Vérifier que l'événement n'est pas déjà annulé
        if ($evenement->statut === 'annule') {
            return response()->json([
                'success' => false,
                'message' => 'Cet événement est déjà annulé.',
            ], 409);
        }

        // Vérifier que l'événement n'est pas terminé
        if ($evenement->statut === 'termine') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible d\'annuler un événement terminé.',
            ], 409);
        }

        $evenement->update(['statut' => 'annule']);

        // TODO: Envoyer un email à chaque participant inscrit

        return response()->json([
            'success' => true,
            'message' => 'Événement annulé avec succès.',
        ], 200);
    }

    /**
     * Supprimer un événement
     */
    public function destroy($id)
    {
        $evenement = Evenement::findOrFail($id);

        // Impossible de supprimer un événement publié
        if ($evenement->statut === 'publie') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer un événement publié. Annulez-le d\'abord.',
            ], 409);
        }

        // Impossible de supprimer un événement avec des inscriptions
        if ($evenement->inscriptions()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer cet événement car il a des inscriptions.',
            ], 409);
        }

        $evenement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Événement supprimé avec succès',
        ], 200);
    }
}
