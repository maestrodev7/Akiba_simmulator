<?php

declare(strict_types=1);

namespace App\Domain\Payment\Repository;

interface PaymentGatewayInterface
{
    public function issueAccessTokenFromRefreshToken(): string;

    /**
     * @param array{
     *   amount:float,
     *   account_number:string
     * } $payload
     * @return array<string,mixed>
     */
    public function initiateDeposit(string $accessToken, array $payload): array;

    /**
     * @param array{
     *   amount:float
     * } $payload
     * @return array<string,mixed>
     */
    public function initiateCardDeposit(string $accessToken, array $payload): array;

    /**
     * @return array<string,mixed>
     */
    public function getTransactionByReference(string $accessToken, string $reference): array;
}

