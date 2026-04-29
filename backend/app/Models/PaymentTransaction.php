<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class PaymentTransaction extends Model
{
    protected $fillable = [
        'reference',
        'session_id',
        'amount',
        'channel',
        'status',
        'provider_response',
        'last_status_payload',
        'last_checked_at',
    ];

    protected $casts = [
        'provider_response' => 'array',
        'last_status_payload' => 'array',
        'last_checked_at' => 'datetime',
        'amount' => 'decimal:2',
    ];
}

