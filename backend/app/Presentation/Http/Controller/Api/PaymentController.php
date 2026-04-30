<?php

declare(strict_types=1);

namespace App\Presentation\Http\Controller\Api;

use App\Application\Payment\Service\PaymentTransactionStatusSyncer;
use App\Application\Payment\UseCase\InitiateDepositUseCase;
use App\Application\Payment\Support\ProviderTransactionData;
use App\Http\Controllers\Controller;
use App\Models\PaymentTransaction;
use App\Presentation\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Throwable;

final class PaymentController extends Controller
{
    public function __construct(
        private readonly InitiateDepositUseCase $initiateDepositUseCase,
        private readonly PaymentTransactionStatusSyncer $paymentTransactionStatusSyncer,
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

        $this->recordTransaction(
            providerResponse: $result,
            amount: (float) $data['amount'],
            channel: 'mobile_money'
        );

        return ApiResponse::success($result, 'Paiement initié.');
    }

    public function depositCard(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Données invalides.', 422, $validator->errors()->toArray());
        }

        $data = $validator->validated();

        try {
            $result = $this->initiateDepositUseCase->executeCard([
                'amount' => (float) $data['amount'],
            ]);
        } catch (Throwable $e) {
            return ApiResponse::error($e->getMessage(), 502);
        }

        $transaction = $this->recordTransaction(
            providerResponse: $result,
            amount: (float) $data['amount'],
            channel: 'card'
        );

        $sessionId = $transaction->session_id;
        if ($sessionId === '') {
            return ApiResponse::error('Session de paiement introuvable dans la réponse KratosPay.', 502);
        }

        $paymentUrlBase = rtrim(
            (string) config('services.kratospay.card_payment_page_base_url', 'https://master.kratos-travel.com/'),
            '/'
        );
        $paymentUrl = $paymentUrlBase . '/?sessionId=' . rawurlencode($sessionId);

        return ApiResponse::success([
            'session_id' => $sessionId,
            'payment_url' => $paymentUrl,
            'provider_response' => $result,
        ], 'Paiement carte initié.');
    }

    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 20);
        $perPage = min(max($perPage, 1), 100);

        $paginator = PaymentTransaction::query()
            ->orderByDesc('updated_at')
            ->paginate($perPage);

        return ApiResponse::fromPaginator($paginator);
    }

    public function status(string $reference): JsonResponse
    {
        if ($reference === '') {
            return ApiResponse::error('Référence manquante.', 422);
        }

        try {
            $existing = PaymentTransaction::query()
                ->where('reference', $reference)
                ->first();
            $syncResult = $this->paymentTransactionStatusSyncer->syncByReference($reference, $existing);
        } catch (Throwable $e) {
            return ApiResponse::error($e->getMessage(), 502);
        }

        return ApiResponse::success([
            'transaction' => $syncResult['transaction'],
            'provider_response' => $syncResult['payload'],
            'status_changed' => $syncResult['status_changed'],
        ]);
    }

    /**
     * @param array<string,mixed> $providerResponse
     */
    private function recordTransaction(
        array $providerResponse,
        float $amount,
        string $channel,
    ): PaymentTransaction
    {
        $reference = ProviderTransactionData::extractReference($providerResponse);
        $sessionId = ProviderTransactionData::extractSessionId($providerResponse);
        $status = ProviderTransactionData::extractStatus($providerResponse) ?? 'pending';

        if ($reference !== null) {
            $transaction = PaymentTransaction::query()->firstOrNew(['reference' => $reference]);
        } else {
            $transaction = new PaymentTransaction();
        }

        $transaction->reference = $reference ?? $transaction->reference;
        $transaction->session_id = $sessionId ?? $transaction->session_id;
        $transaction->amount = $amount;
        $transaction->channel = $channel;
        $transaction->status = $status;
        $transaction->provider_response = $providerResponse;
        $transaction->save();

        return $transaction;
    }
}

