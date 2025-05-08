<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('livreur_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('code_promo_id')->nullable()->constrained('code_promos')->nullOnDelete();
            $table->enum('statut', ['en_attente', 'confirmée', 'en_livraison', 'livrée', 'retour', 'annulée'])->default('en_attente');
            $table->dateTime('heure_estimee_livraison')->nullable();
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
