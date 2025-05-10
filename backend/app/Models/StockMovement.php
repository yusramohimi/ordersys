<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovement extends Model
{
    protected $fillable = ['produit_id', 'type', 'quantite', 'motif'];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }
}

