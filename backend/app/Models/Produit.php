<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produit extends Model
{
    protected $fillable = ['nom', 'description', 'prix_unitaire' , 'stock_initial'];

    public function commandes(): BelongsToMany
    {
        return $this->belongsToMany(Commande::class, 'commande_produit')->withPivot('quantite', 'prix_unitaire');
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }
    public function stockActuel(): int
{
    $entrées = $this->stockMovements()->where('type', 'entree')->sum('quantite');
    $sorties = $this->stockMovements()->where('type', 'sortie')->sum('quantite');
    $ajustements = $this->stockMovements()->where('type', 'ajustement')->sum('quantite');

    return $this->stock_initial + $entrées + $ajustements - $sorties;
}

}

