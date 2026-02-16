<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('terrains', function (Blueprint $table) {
            $table->string('id', 24)->primary();
            $table->string('client_id', 24);
            $table->string('adresse', 500)->nullable();
            $table->decimal('superficie', 12, 2)->nullable();
            $table->string('titre_foncier', 100)->nullable();
            $table->string('site', 100)->nullable();
            $table->string('situation', 100)->nullable();
            $table->string('topographie', 100)->nullable();
            $table->timestamps();
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('terrains');
    }
};
