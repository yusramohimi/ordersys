<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Region extends Model
{
    protected $fillable = ['nom'];

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }

    public function livreurs(): HasMany
    {
        return $this->hasMany(Livreur::class);
    }
}

