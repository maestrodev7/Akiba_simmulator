<?php

declare(strict_types=1);

namespace App\Presentation\Http\Controller\Api;

use App\Application\Terrain\Dto\TerrainDto;
use App\Application\Terrain\UseCase\CreateTerrainUseCase;
use App\Application\Terrain\UseCase\GetTerrainUseCase;
use App\Application\Terrain\UseCase\ListTerrainsByClientUseCase;
use App\Application\Terrain\UseCase\UpdateTerrainUseCase;
use App\Http\Controllers\Controller;
use App\Presentation\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class TerrainController extends Controller
{
    public function __construct(
        private readonly CreateTerrainUseCase $createTerrainUseCase,
        private readonly UpdateTerrainUseCase $updateTerrainUseCase,
        private readonly GetTerrainUseCase $getTerrainUseCase,
        private readonly ListTerrainsByClientUseCase $listTerrainsByClientUseCase,
    ) {
    }

    public function index(string $clientId): JsonResponse
    {
        $items = $this->listTerrainsByClientUseCase->execute($clientId);
        return ApiResponse::success(array_map(fn ($dto) => $this->toArray($dto), $items));
    }

    public function store(Request $request, string $clientId): JsonResponse
    {
        $dto = TerrainDto::fromArray($request->all());
        $resource = $this->createTerrainUseCase->execute($clientId, $dto);
        return ApiResponse::created($this->toArray($resource), 'Terrain créé.');
    }

    public function show(string $clientId, string $terrain): JsonResponse
    {
        $resource = $this->getTerrainUseCase->execute($terrain);
        return ApiResponse::success($this->toArray($resource));
    }

    public function update(Request $request, string $clientId, string $terrain): JsonResponse
    {
        $dto = TerrainDto::fromArray($request->all());
        $resource = $this->updateTerrainUseCase->execute($terrain, $dto);
        return ApiResponse::success($this->toArray($resource), 'Terrain mis à jour.');
    }

    /** @param \App\Application\Terrain\Dto\TerrainResourceDto $dto */
    private function toArray($dto): array
    {
        return [
            'id' => $dto->id,
            'client_id' => $dto->clientId,
            'adresse' => $dto->adresse,
            'superficie' => $dto->superficie,
            'titre_foncier' => $dto->titreFoncier,
            'site' => $dto->site,
            'situation' => $dto->situation,
            'topographie' => $dto->topographie,
        ];
    }
}
