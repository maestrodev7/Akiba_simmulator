<?php

declare(strict_types=1);

namespace App\Presentation\Http\Controller\Api;

use App\Application\Payment\Support\PaymentAmountSetting;
use App\Http\Controllers\Controller;
use App\Presentation\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

final class PaymentSettingsController extends Controller
{
    public function showAmount(): JsonResponse
    {
        return ApiResponse::success([
            'amount' => PaymentAmountSetting::get(),
        ]);
    }

    public function updateAmount(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Données invalides.', 422, $validator->errors()->toArray());
        }

        $data = $validator->validated();
        $amount = (float) $data['amount'];

        PaymentAmountSetting::set($amount);

        return ApiResponse::success([
            'amount' => $amount,
        ], 'Montant de paiement mis à jour.');
    }
}

