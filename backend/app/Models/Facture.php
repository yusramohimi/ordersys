<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Facture extends Model
{
    protected $fillable = ['commande_id'];

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }
}


