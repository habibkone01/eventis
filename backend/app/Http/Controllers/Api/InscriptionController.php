<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInscriptionRequest;
use App\Http\Resources\InscriptionResource;
use App\Mail\InscriptionConfirmationMail;
use App\Models\Evenement;
use App\Models\Inscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class InscriptionController extends Controller
{
    /**
     * Liste de toutes les inscriptions (admin)
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 15);
        $inscriptions = Inscription::with(['evenement'])
            ->when($request->evenement_id, function ($query) use ($request) {
                $query->where('evenement_id', $request->evenement_id);
            })
            ->when($request->search, function ($query) use ($request) {
                $query->where('nom_participant', 'like', '%' . $request->search . '%')
                    ->orWhere('email_participant', 'like', '%' . $request->search . '%');
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return InscriptionResource::collection($inscriptions);
    }

    /**
     * Voir une inscription (admin)
     */
    public function show($id)
    {
        $inscription = Inscription::with(['evenement'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'inscription' => new InscriptionResource($inscription),
        ], 200);
    }

    /**
     * Créer une inscription (public)
     */
    public function store(StoreInscriptionRequest $request)
    {
        $evenement = Evenement::findOrFail($request->evenement_id);

        // Vérifier que l'événement est publié
        if ($evenement->statut !== 'publie') {
            return response()->json([
                'success' => false,
                'message' => 'Les inscriptions ne sont pas ouvertes pour cet événement.',
            ], 409);
        }

        // Vérifier si la capacité max est atteinte
        if ($evenement->capacite_max) {
            $nbInscrits = Inscription::where('evenement_id', $evenement->id)->count();
            if ($nbInscrits >= $evenement->capacite_max) {
                return response()->json([
                    'success' => false,
                    'message' => 'La capacité maximale de cet événement est atteinte.',
                ], 409);
            }
        }

        // Vérifier si le participant est déjà inscrit
        $dejaInscrit = Inscription::where('evenement_id', $request->evenement_id)
            ->where('email_participant', $request->email_participant)
            ->exists();

        if ($dejaInscrit) {
            return response()->json([
                'success' => false,
                'message' => 'Vous êtes déjà inscrit à cet événement.',
            ], 409);
        }

        $inscription = Inscription::create(array_merge(
            $request->validated(),
            ['token_desinscription' => Str::uuid()]
        ));

        Mail::to($inscription->email_participant)->send(new InscriptionConfirmationMail($inscription->load('evenement')));

        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie ! Un email de confirmation vous a été envoyé.',
            'inscription' => new InscriptionResource($inscription->load('evenement')),
        ], 201);
    }

    /**
     * Désinscription via token (public)
     */
    public function desinscription($token)
    {
        $inscription = Inscription::where('token_desinscription', $token)->firstOrFail();

        // Vérifier que l'événement n'est pas terminé ou annulé
        if (in_array($inscription->evenement->statut, ['termine', 'annule'])) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de se désinscrire d\'un événement terminé ou annulé.',
            ], 409);
        }

        $inscription->delete();

        return response()->json([
            'success' => true,
            'message' => 'Désinscription effectuée avec succès.',
        ], 200);
    }

    /**
     * Supprimer une inscription (admin)
     */
    public function destroy($id)
    {
        $inscription = Inscription::findOrFail($id);
        $inscription->delete();

        return response()->json([
            'success' => true,
            'message' => 'Inscription supprimée avec succès.',
        ], 200);
    }
}
