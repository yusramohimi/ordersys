<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommandeProduit extends Model
{
    protected $table = 'commande_produit';
    protected $fillable = ['commande_id', 'produit_id', 'quantite', 'prix_unitaire'];
}


