<?php

declare(strict_types=1);

namespace App\Presentation\Http\Controller\Api;

use App\Application\Payment\UseCase\GetTransactionStatusUseCase;
use App\Application\Payment\UseCase\InitiateDepositUseCase;
use App\Http\Controllers\Controller;
use App\Presentation\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Throwable;

final class PaymentController extends Controller
{
    public function __construct(
        private readonly InitiateDepositUseCase $initiateDepositUseCase,
        private readonly GetTransactionStatusUseCase $getTransactionStatusUseCase,
    ) {
    }

    public function deposit(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1',
            'account_number' => 'required|string|max:30',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Données invalides.', 422, $validator->errors()->toArray());
        }

        $data = $validator->validated();

        try {
            $result = $this->initiateDepositUseCase->execute([
                'amount' => (float) $data['amount'],
                'account_number' => (string) $data['account_number'],
            ]);
        } catch (Throwable $e) {
            return ApiResponse::error($e->getMessage(), 502);
        }

        return ApiResponse::success($result, 'Paiement initié.');
    }

    public function status(string $reference): JsonResponse
    {
        if ($reference === '') {
            return ApiResponse::error('Référence manquante.', 422);
        }

        try {
            $result = $this->getTransactionStatusUseCase->execute($reference);
        } catch (Throwable $e) {
            return ApiResponse::error($e->getMessage(), 502);
        }

        return ApiResponse::success($result);
    }
}

