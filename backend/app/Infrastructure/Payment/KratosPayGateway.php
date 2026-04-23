<?php

declare(strict_types=1);

namespace App\Infrastructure\Payment;

use App\Domain\Payment\Repository\PaymentGatewayInterface;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

final class KratosPayGateway implements PaymentGatewayInterface
{
    public function issueAccessTokenFromRefreshToken(): string
    {
        $refreshToken = (string) config('services.kratospay.refresh_token', '');
        if ($refreshToken === '') {
            throw new RuntimeException('Configuration KratosPay manquante: refresh token.');
        }

        try {
            $response = Http::baseUrl($this->baseUrl())
                ->acceptJson()
                ->asJson()
                ->connectTimeout($this->connectTimeout())
                ->timeout($this->timeout())
                ->post('/api/auth/refresh-token', [
                    'refreshToken' => $refreshToken,
                ]);
        } catch (ConnectionException) {
            throw new RuntimeException('Timeout lors du refresh token KratosPay.');
        }

        if (!$response->successful()) {
            throw new RuntimeException('Impossible de rafraîchir le token KratosPay.');
        }

        $token = (string) data_get($response->json(), 'content', '');
        if ($token === '') {
            throw new RuntimeException('Réponse refresh token invalide.');
        }

        return $token;
    }

    public function initiateDeposit(string $accessToken, array $payload): array
    {
        $paymentToken = (string) config('services.kratospay.payment_token', '');
        if ($paymentToken === '') {
            throw new RuntimeException('Configuration KratosPay manquante: payment token.');
        }

        $requestPayload = [
            'amount' => $payload['amount'] ?? null,
            'account_number' => $payload['account_number'] ?? null,
            'payment_token' => $paymentToken,
        ];

        try {
            $response = Http::baseUrl($this->baseUrl())
                ->acceptJson()
                ->asJson()
                ->connectTimeout($this->connectTimeout())
                ->timeout($this->timeout())
                ->withToken($accessToken)
                ->post($this->depositPath(), $requestPayload);
        } catch (ConnectionException) {
            throw new RuntimeException('Timeout pendant l’initiation du dépôt chez KratosPay.');
        }

        if (!$response->successful()) {
            $message = (string) data_get($response->json(), 'message', 'Échec du dépôt.');
            throw new RuntimeException($message);
        }

        /** @var array<string,mixed> */
        return $response->json();
    }

    public function getTransactionByReference(string $accessToken, string $reference): array
    {
        try {
            $response = Http::baseUrl($this->baseUrl())
                ->acceptJson()
                ->asJson()
                ->connectTimeout($this->connectTimeout())
                ->timeout($this->timeout())
                ->withToken($accessToken)
                ->get('/api/transactions/reference/' . urlencode($reference));
        } catch (ConnectionException) {
            throw new RuntimeException('Timeout pendant la vérification du statut chez KratosPay.');
        }

        if (!$response->successful()) {
            $message = (string) data_get($response->json(), 'message', 'Échec de récupération du statut.');
            throw new RuntimeException($message);
        }

        /** @var array<string,mixed> */
        return $response->json();
    }

    private function baseUrl(): string
    {
        return rtrim((string) config('services.kratospay.base_url', 'https://backendpay.kratospay.com'), '/');
    }

    private function timeout(): int
    {
        return (int) config('services.kratospay.timeout', 20);
    }

    private function connectTimeout(): int
    {
        return (int) config('services.kratospay.connect_timeout', 10);
    }

    private function depositPath(): string
    {
        return (string) config('services.kratospay.deposit_path', '/api/wallet/public/deposit');
    }
}

