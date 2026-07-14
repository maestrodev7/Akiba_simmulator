<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->unsignedInteger('nombre_enfants')->nullable()->after('numero_registre');
            $table->decimal('budget_previsionnel', 15, 2)->nullable()->after('nombre_enfants');
        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['nombre_enfants', 'budget_previsionnel']);
        });
    }
};
