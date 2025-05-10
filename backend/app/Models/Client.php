<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $fillable = ['nom', 'prenom', 'telephone', 'email', 'ville', 'region_id', 'adresse', 'info_additionnelle', 'password'];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function commandes(): HasMany
    {
        return $this->hasMany(Commande::class);
    }
}


