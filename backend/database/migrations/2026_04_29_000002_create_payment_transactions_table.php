<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_transactions', function (Blueprint $table): void {
            $table->id();
            $table->string('reference')->nullable()->index();
            $table->string('session_id')->nullable()->index();
            $table->decimal('amount', 15, 2)->default(0);
            $table->string('channel', 30)->default('unknown');
            $table->string('status', 30)->default('pending')->index();
            $table->json('provider_response')->nullable();
            $table->json('last_status_payload')->nullable();
            $table->timestamp('last_checked_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};

