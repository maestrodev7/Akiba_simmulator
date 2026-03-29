<?php

declare(strict_types=1);

namespace App\Presentation\Http\Controller\Api;

use App\Application\Piece\UseCase\CreateCustomPieceUseCase;
use App\Application\Piece\UseCase\ListPiecesUseCase;
use App\Http\Controllers\Controller;
use App\Presentation\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

final class PieceController extends Controller
{
    public function __construct(
        private readonly ListPiecesUseCase $listPiecesUseCase,
        private readonly CreateCustomPieceUseCase $createCustomPieceUseCase,
    ) {
    }

    /** Catalogue des pièces (référentiel + pièces personnalisées). */
    public function index(): JsonResponse
    {
        $items = $this->listPiecesUseCase->execute();
        return ApiResponse::success($items);
    }

    /** Création d'une pièce hors catalogue (nom + superficie par défaut pour l'estimation SP). */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'designation' => 'required|string|max:255',
            'surface_standard' => 'required|numeric|min:0.01|max:99999',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Données invalides.', 422, $validator->errors()->toArray());
        }

        $data = $validator->validated();
        $resource = $this->createCustomPieceUseCase->execute(
            (string) $data['designation'],
            (float) $data['surface_standard'],
        );

        return ApiResponse::created($resource, 'Pièce créée.');
    }
}
