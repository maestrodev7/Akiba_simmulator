<?php

declare(strict_types=1);

namespace App\Presentation\Http\Controller\Api;

use App\Application\Piece\UseCase\ListPiecesUseCase;
use App\Http\Controllers\Controller;
use App\Presentation\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

final class PieceController extends Controller
{
    public function __construct(
        private readonly ListPiecesUseCase $listPiecesUseCase,
    ) {
    }

    /** Catalogue des pièces (référentiel). */
    public function index(): JsonResponse
    {
        $items = $this->listPiecesUseCase->execute();
        return ApiResponse::success($items);
    }
}
