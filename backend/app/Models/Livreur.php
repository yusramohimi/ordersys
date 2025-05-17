<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Livreur extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['nom', 'email', 'telephone', 'region_id', 'password'];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function commandes(): HasMany
    {
        return $this->hasMany(Commande::class);
    }
}
