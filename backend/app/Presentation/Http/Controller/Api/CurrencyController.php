<?php

declare(strict_types=1);

namespace App\Presentation\Http\Controller\Api;

use App\Application\Payment\Support\CurrencyConverter;
use App\Http\Controllers\Controller;
use App\Presentation\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

final class CurrencyController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success([
            'base' => CurrencyConverter::BASE,
            'rates' => CurrencyConverter::rates(),
            'labels' => CurrencyConverter::labels(),
        ]);
    }
}
