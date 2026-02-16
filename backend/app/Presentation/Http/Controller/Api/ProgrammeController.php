<?php

declare(strict_types=1);

namespace App\Presentation\Http\Controller\Api;

use App\Application\Programme\Dto\LigneProgrammeDto;
use App\Application\Programme\UseCase\AddLigneProgrammeUseCase;
use App\Application\Programme\UseCase\ListLignesByProduitUseCase;
use App\Application\Programme\UseCase\UpdateLigneProgrammeUseCase;
use App\Http\Controllers\Controller;
use App\Presentation\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ProgrammeController extends Controller
{
    public function __construct(
        private readonly AddLigneProgrammeUseCase $addLigneProgrammeUseCase,
        private readonly UpdateLigneProgrammeUseCase $updateLigneProgrammeUseCase,
        private readonly ListLignesByProduitUseCase $listLignesByProduitUseCase,
    ) {
    }

    public function index(string $clientId, string $terrainId, string $produit): JsonResponse
    {
        $items = $this->listLignesByProduitUseCase->execute($produit);
        return ApiResponse::success($items);
    }

    public function store(Request $request, string $clientId, string $terrainId, string $produit): JsonResponse
    {
        $dto = LigneProgrammeDto::fromArray($request->all());
        $id = $this->addLigneProgrammeUseCase->execute($produit, $dto);
        return ApiResponse::created(['id' => $id], 'Ligne de programme ajoutée.');
    }

    public function update(Request $request, string $clientId, string $terrainId, string $produit, string $ligneId): JsonResponse
    {
        $dto = LigneProgrammeDto::fromArray($request->all());
        $this->updateLigneProgrammeUseCase->execute($ligneId, $dto);
        return ApiResponse::success(null, 'Ligne de programme mise à jour.');
    }
}
