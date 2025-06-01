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
    Schema::table('produits', function (Blueprint $table) {
        $table->integer('stock_initial')->default(0)->after('prix_unitaire');
    });
}

public function down(): void
{
    Schema::table('produits', function (Blueprint $table) {
        $table->dropColumn('stock_initial');
    });
}

};
