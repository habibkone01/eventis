<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Evenement extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'evenements';

    protected $fillable = [
        'user_id',
        'categorie_id',
        'organisateur_id',
        'localisation_id',
        'titre',
        'description',
        'date_debut',
        'date_fin',
        'lieu',
        'capacite_max',
        'statut',
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'date_debut' => 'datetime',
            'date_fin'   => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class)->withTrashed();
    }

    public function organisateur()
    {
        return $this->belongsTo(Organisateur::class)->withTrashed();
    }

    public function localisation()
    {
        return $this->belongsTo(Localisation::class)->withTrashed();
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }
}
