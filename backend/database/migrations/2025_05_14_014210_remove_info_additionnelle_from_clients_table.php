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
    Schema::table('clients', function (Blueprint $table) {
        $table->dropColumn('info_additionnelle');
    });
}

public function down(): void
{
    Schema::table('clients', function (Blueprint $table) {
        $table->text('info_additionnelle')->nullable(); 
    });
}
};
