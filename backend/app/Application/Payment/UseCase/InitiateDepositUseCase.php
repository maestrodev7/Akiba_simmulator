<?php

declare(strict_types=1);

namespace App\Application\Payment\UseCase;

use App\Domain\Payment\Repository\PaymentGatewayInterface;

final class InitiateDepositUseCase
{
    public function __construct(
        private readonly PaymentGatewayInterface $paymentGateway,
    ) {
    }

    /**
     * @param array{
     *   amount:float,
     *   account_number:string
     * } $payload
     * @return array<string,mixed>
     */
    public function execute(array $payload): array
    {
        $accessToken = $this->paymentGateway->issueAccessTokenFromRefreshToken();
        return $this->paymentGateway->initiateDeposit($accessToken, $payload);
    }
}

