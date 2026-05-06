<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\PaymentTransaction;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class PaymentTransactionStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(
        public PaymentTransaction $transaction,
    ) {
    }

    public function broadcastOn(): array
    {
        $channels = [new Channel('transactions')];

        if (is_string($this->transaction->reference) && $this->transaction->reference !== '') {
            $channels[] = new Channel('transactions.' . $this->transaction->reference);
        }

        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'transaction.status.updated';
    }

    /**
     * @return array<string,mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->transaction->id,
            'client_id' => $this->transaction->client_id,
            'reference' => $this->transaction->reference,
            'session_id' => $this->transaction->session_id,
            'status' => $this->transaction->status,
            'channel' => $this->transaction->channel,
            'amount' => (float) $this->transaction->amount,
            'updated_at' => optional($this->transaction->updated_at)?->toIso8601String(),
        ];
    }
}

