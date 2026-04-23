<?php

declare(strict_types=1);

namespace App\Application\Payment\UseCase;

use App\Domain\Payment\Repository\PaymentGatewayInterface;

final class GetTransactionStatusUseCase
{
    public function __construct(
        private readonly PaymentGatewayInterface $paymentGateway,
    ) {
    }

    /**
     * @return array<string,mixed>
     */
    public function execute(string $reference): array
    {
        $accessToken = $this->paymentGateway->issueAccessTokenFromRefreshToken();
        return $this->paymentGateway->getTransactionByReference($accessToken, $reference);
    }
}

