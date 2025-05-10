<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Livreur extends Model
{
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
