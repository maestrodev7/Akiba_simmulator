<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table): void {
            $table->string('simulation_payment_status', 30)->default('unpaid')->after('numero_registre');
            $table->timestamp('simulation_paid_at')->nullable()->after('simulation_payment_status');
        });

        Schema::table('payment_transactions', function (Blueprint $table): void {
            $table->string('client_id', 24)->nullable()->after('id')->index();
            $table->foreign('client_id')->references('id')->on('clients')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('payment_transactions', function (Blueprint $table): void {
            $table->dropForeign(['client_id']);
            $table->dropColumn('client_id');
        });

        Schema::table('clients', function (Blueprint $table): void {
            $table->dropColumn(['simulation_payment_status', 'simulation_paid_at']);
        });
    }
};

