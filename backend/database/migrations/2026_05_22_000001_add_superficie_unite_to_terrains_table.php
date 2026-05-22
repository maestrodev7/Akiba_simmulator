<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('terrains', function (Blueprint $table): void {
            $table->string('superficie_unite', 10)->default('m2')->after('superficie');
        });
    }

    public function down(): void
    {
        Schema::table('terrains', function (Blueprint $table): void {
            $table->dropColumn('superficie_unite');
        });
    }
};
