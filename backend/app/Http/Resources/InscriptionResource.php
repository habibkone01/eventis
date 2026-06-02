<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InscriptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom_participant' => $this->nom_participant,
            'email_participant' => $this->email_participant,
            'inscrit_le' => $this->inscrit_le->format('d-m-Y H:i'),
            'evenement' => new EvenementResource($this->whenLoaded('evenement')),
            'created_at' => $this->created_at->format('d-m-Y H:i'),
            'updated_at' => $this->updated_at->format('d-m-Y H:i'),
        ];
    }
}
