<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programme_lignes', function (Blueprint $table) {
            $table->string('id', 24)->primary();
            $table->string('produit_id', 24);
            $table->string('piece_id', 24);
            $table->unsignedInteger('nombre')->default(1);
            $table->decimal('surface_personnalisee', 10, 2)->nullable();
            $table->timestamps();
            $table->foreign('produit_id')->references('id')->on('produits')->onDelete('cascade');
            $table->foreign('piece_id')->references('id')->on('pieces')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programme_lignes');
    }
};
