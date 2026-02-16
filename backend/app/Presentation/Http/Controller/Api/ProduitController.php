<?php

declare(strict_types=1);

namespace App\Presentation\Http\Controller\Api;

use App\Application\Produit\Dto\ProduitDto;
use App\Application\Produit\UseCase\CreateProduitUseCase;
use App\Application\Produit\UseCase\GetProduitUseCase;
use App\Application\Produit\UseCase\ListProduitsByTerrainUseCase;
use App\Application\Produit\UseCase\UpdateProduitUseCase;
use App\Http\Controllers\Controller;
use App\Presentation\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ProduitController extends Controller
{
    public function __construct(
        private readonly CreateProduitUseCase $createProduitUseCase,
        private readonly UpdateProduitUseCase $updateProduitUseCase,
        private readonly GetProduitUseCase $getProduitUseCase,
        private readonly ListProduitsByTerrainUseCase $listProduitsByTerrainUseCase,
    ) {
    }

    public function index(string $clientId, string $terrainId): JsonResponse
    {
        $items = $this->listProduitsByTerrainUseCase->execute($terrainId);
        return ApiResponse::success(array_map(fn ($dto) => $this->toArray($dto), $items));
    }

    public function store(Request $request, string $clientId, string $terrainId): JsonResponse
    {
        $dto = ProduitDto::fromArray($request->all());
        $resource = $this->createProduitUseCase->execute($terrainId, $dto);
        return ApiResponse::created($this->toArray($resource), 'Produit créé.');
    }

    public function show(string $clientId, string $terrainId, string $produit): JsonResponse
    {
        $resource = $this->getProduitUseCase->execute($produit);
        return ApiResponse::success($this->toArray($resource));
    }

    public function update(Request $request, string $clientId, string $terrainId, string $produit): JsonResponse
    {
        $dto = ProduitDto::fromArray($request->all());
        $resource = $this->updateProduitUseCase->execute($produit, $dto);
        return ApiResponse::success($this->toArray($resource), 'Produit mis à jour.');
    }

    /** @param \App\Application\Produit\Dto\ProduitResourceDto $dto */
    private function toArray($dto): array
    {
        return [
            'id' => $dto->id,
            'terrain_id' => $dto->terrainId,
            'type_produit' => $dto->typeProduit,
            'materiaux' => $dto->materiaux,
            'standing' => $dto->standing,
            'budget_previsionnel' => $dto->budgetPrevisionnel,
            'date_debut_travaux' => $dto->dateDebutTravaux,
            'date_fin_travaux' => $dto->dateFinTravaux,
            'caracteristiques' => $dto->caracteristiques,
        ];
    }
}
