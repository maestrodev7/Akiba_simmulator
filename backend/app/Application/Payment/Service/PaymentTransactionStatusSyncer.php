<?php

declare(strict_types=1);

namespace App\Application\Payment\Service;

use App\Application\Payment\Support\ProviderTransactionData;
use App\Application\Payment\UseCase\GetTransactionStatusUseCase;
use App\Events\PaymentTransactionStatusUpdated;
use App\Infrastructure\Persistence\Eloquent\ClientModel;
use App\Models\PaymentTransaction;
use Illuminate\Support\Carbon;
use Throwable;

final class PaymentTransactionStatusSyncer
{
    public function __construct(
        private readonly GetTransactionStatusUseCase $getTransactionStatusUseCase,
    ) {
    }

    /**
     * @return array{transaction:PaymentTransaction,payload:array<string,mixed>,status_changed:bool}
     */
    public function syncByReference(string $reference, ?PaymentTransaction $transaction = null): array
    {
        $payload = $this->getTransactionStatusUseCase->execute($reference);
        $normalizedStatus = ProviderTransactionData::extractStatus($payload);
        $resolvedReference = ProviderTransactionData::extractReference($payload) ?? $reference;
        $sessionId = ProviderTransactionData::extractSessionId($payload);

        $transaction ??= PaymentTransaction::query()->firstOrCreate(
            ['reference' => $reference],
            [
                'channel' => 'unknown',
                'status' => $normalizedStatus ?? 'pending',
            ]
        );

        $previousStatus = (string) $transaction->status;
        $nextStatus = $normalizedStatus ?? $previousStatus;

        $transaction->reference = $resolvedReference;
        if ($sessionId !== null && $sessionId !== '') {
            $transaction->session_id = $sessionId;
        }
        $transaction->status = $nextStatus;
        $transaction->last_status_payload = $payload;
        $transaction->last_checked_at = Carbon::now();
        $transaction->save();

        $statusChanged = $previousStatus !== $nextStatus;
        $this->updateClientPaymentStatusIfNeeded($transaction, $nextStatus);
        if ($statusChanged) {
            event(new PaymentTransactionStatusUpdated($transaction->fresh()));
        }

        /** @var array{transaction:PaymentTransaction,payload:array<string,mixed>,status_changed:bool} */
        return [
            'transaction' => $transaction,
            'payload' => $payload,
            'status_changed' => $statusChanged,
        ];
    }

    /**
     * @return array{checked:int,updated:int,failed:int}
     */
    public function syncPendingTransactions(): array
    {
        $checked = 0;
        $updated = 0;
        $failed = 0;

        PaymentTransaction::query()
            ->where('status', 'pending')
            ->whereNotNull('reference')
            ->orderBy('id')
            ->chunkById(100, function ($transactions) use (&$checked, &$updated, &$failed): void {
                foreach ($transactions as $transaction) {
                    ++$checked;
                    try {
                        $result = $this->syncByReference((string) $transaction->reference, $transaction);
                        if ($result['status_changed']) {
                            ++$updated;
                        }
                    } catch (Throwable) {
                        ++$failed;
                    }
                }
            });

        return [
            'checked' => $checked,
            'updated' => $updated,
            'failed' => $failed,
        ];
    }

    private function updateClientPaymentStatusIfNeeded(PaymentTransaction $transaction, string $status): void
    {
        if (!$this->isPaidStatus($status)) {
            return;
        }

        $clientId = (string) ($transaction->client_id ?? '');
        if ($clientId === '') {
            return;
        }

        $client = ClientModel::query()->find($clientId);
        if ($client === null) {
            return;
        }

        $client->simulation_payment_status = 'paid';
        if ($client->simulation_paid_at === null) {
            $client->simulation_paid_at = Carbon::now();
        }
        $client->save();
    }

    private function isPaidStatus(string $status): bool
    {
        return in_array(strtolower($status), ['paid', 'success', 'successful', 'completed'], true);
    }
}

