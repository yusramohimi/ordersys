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
        Schema::create('code_promos', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->decimal('reduction', 8, 2);
            $table->enum('type', ['montant', 'pourcentage']);
            $table->dateTime('expire_le');
            $table->integer('utilisations_max');
            $table->integer('utilisations_actuelles')->default(0);
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('code_promos');
    }
};
