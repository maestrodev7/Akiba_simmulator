<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produits', function (Blueprint $table) {
            $table->string('id', 24)->primary();
            $table->string('terrain_id', 24);
            $table->string('type_produit', 100)->nullable();
            $table->string('materiaux', 50)->nullable();
            $table->string('standing', 50)->nullable();
            $table->decimal('budget_previsionnel', 14, 2)->nullable();
            $table->date('date_debut_travaux')->nullable();
            $table->date('date_fin_travaux')->nullable();
            $table->json('caracteristiques')->nullable();
            $table->timestamps();
            $table->foreign('terrain_id')->references('id')->on('terrains')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
