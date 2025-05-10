<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CodePromo extends Model
{
    protected $fillable = ['code', 'reduction', 'type', 'expire_le', 'utilisations_max', 'utilisations_actuelles'];

    public function commandes(): HasMany
    {
        return $this->hasMany(Commande::class);
    }
}


