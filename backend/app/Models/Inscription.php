<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inscription extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'inscriptions';

    protected $fillable = [
        'evenement_id',
        'nom_participant',
        'email_participant',
        'token_desinscription',
        'inscrit_le',
    ];

    protected function casts(): array
    {
        return [
            'inscrit_le' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function evenement()
    {
        return $this->belongsTo(Evenement::class)->withTrashed();
    }
}
