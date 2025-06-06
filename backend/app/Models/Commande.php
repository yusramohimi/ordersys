<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Commande extends Model
{
protected $fillable = ['client_id', 'quantite', 'code_promo_id', 'prix_total', 'statut'];
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function livreur(): BelongsTo
    {
        return $this->belongsTo(Livreur::class);
    }

    public function codePromo(): BelongsTo
    {
        return $this->belongsTo(CodePromo::class, 'code_promo_id');
    }

   public function produits()
    {
        return $this->belongsToMany(Produit::class, 'commande_produit') 
        ->withPivot('quantite', 'prix_unitaire');    
    }


    public function facture(): HasOne
    {
        return $this->hasOne(Facture::class);
    }
}


