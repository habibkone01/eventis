<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EvenementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'description' => $this->description,
            'date_debut' => $this->date_debut->format('d-m-Y H:i'),
            'date_fin' => $this->date_fin?->format('d-m-Y H:i'),
            'lieu' => $this->lieu,
            'capacite_max' => $this->capacite_max,
            'statut' => $this->statut,
            'image_url' => $this->image_url,
            'categorie' => new CategorieResource($this->whenLoaded('categorie')),
            'localisation' => new LocalisationResource($this->whenLoaded('localisation')),
            'organisateur' => new OrganisateurResource($this->whenLoaded('organisateur')),
            'created_at' => $this->created_at->format('d-m-Y H:i'),
            'updated_at' => $this->updated_at->format('d-m-Y H:i'),
        ];
    }
}
