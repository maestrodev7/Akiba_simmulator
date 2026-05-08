<?php

declare(strict_types=1);

namespace App\Application\Payment\Support;

final class ProviderTransactionData
{
    /**
     * @param array<string,mixed> $payload
     */
    public static function extractReference(array $payload): ?string
    {
        return self::extractString($payload, [
            'reference',
            'transaction_reference',
            'transactionReference',
            'content.reference',
            'content.transaction_reference',
            'content.transactionReference',
            'data.reference',
            'data.transaction_reference',
            'data.transactionReference',
        ]);
    }

    /**
     * @param array<string,mixed> $payload
     */
    public static function extractSessionId(array $payload): ?string
    {
        return self::extractString($payload, [
            'sessionId',
            'session_id',
            'content.sessionId',
            'content.session_id',
            'data.sessionId',
            'data.session_id',
        ]);
    }

    /**
     * @param array<string,mixed> $payload
     */
    public static function extractStatus(array $payload): ?string
    {
        $status = self::extractString($payload, [
            'status',
            'statut',
            'transaction_status',
            'transactionStatus',
            'content.status',
            'content.statut',
            'content.transaction_status',
            'content.transactionStatus',
            'data.status',
            'data.statut',
            'data.transaction_status',
            'data.transactionStatus',
        ]);

        if ($status === null) {
            return null;
        }

        return self::normalizeStatus($status);
    }

    /**
     * @param array<string,mixed> $payload
     * @param list<string> $paths
     */
    private static function extractString(array $payload, array $paths): ?string
    {
        foreach ($paths as $path) {
            $value = data_get($payload, $path);
            if (is_string($value) && trim($value) !== '') {
                return trim($value);
            }
        }

        return null;
    }

    private static function normalizeStatus(string $rawStatus): string
    {
        $normalized = strtolower(trim($rawStatus));

        return match ($normalized) {
            'reussie', 'réussie', 'success', 'successful', 'completed', 'paid' => 'paid',
            'echec', 'échec', 'failed', 'failure' => 'failed',
            'annulee', 'annulée', 'cancelled', 'canceled' => 'cancelled',
            'en_attente', 'en attente', 'pending' => 'pending',
            default => $normalized,
        };
    }
}

