<?php

declare(strict_types=1);

namespace App\Application\Terrain\UseCase;

use App\Application\Terrain\Dto\TerrainResourceDto;
use App\Domain\Terrain\Entity\Terrain;
use App\Domain\Terrain\Repository\TerrainRepositoryInterface;

final class ListTerrainsByClientUseCase
{
    public function __construct(
        private readonly TerrainRepositoryInterface $terrainRepository,
    ) {
    }

    /** @return list<TerrainResourceDto> */
    public function execute(string $clientId): array
    {
        $terrains = $this->terrainRepository->getByClientId($clientId);
        return array_map(fn (Terrain $t) => new TerrainResourceDto(
            id: $t->getId(),
            clientId: $t->getClientId(),
            adresse: $t->getAdresse(),
            superficie: $t->getSuperficie(),
            titreFoncier: $t->getTitreFoncier(),
            site: $t->getSite(),
            situation: $t->getSituation(),
            topographie: $t->getTopographie(),
        ), $terrains);
    }
}
