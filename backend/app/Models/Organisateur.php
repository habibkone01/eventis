<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organisateur extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'organisateurs';

    protected $fillable = [
        'nom',
        'email',
        'telephone',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'deleted_at' => 'datetime',
        ];
    }

    public function evenements()
    {
        return $this->hasMany(Evenement::class);
    }
}
