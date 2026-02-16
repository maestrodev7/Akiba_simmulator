<?php

declare(strict_types=1);

namespace App\Application\Terrain\UseCase;

use App\Application\Terrain\Dto\TerrainResourceDto;
use App\Domain\Exception\NotFoundException;
use App\Domain\Terrain\Repository\TerrainRepositoryInterface;

final class GetTerrainUseCase
{
    public function __construct(
        private readonly TerrainRepositoryInterface $terrainRepository,
    ) {
    }

    public function execute(string $id): TerrainResourceDto
    {
        $terrain = $this->terrainRepository->getById($id);
        if ($terrain === null) {
            throw new NotFoundException('Terrain non trouvé.');
        }
        return new TerrainResourceDto(
            id: $terrain->getId(),
            clientId: $terrain->getClientId(),
            adresse: $terrain->getAdresse(),
            superficie: $terrain->getSuperficie(),
            titreFoncier: $terrain->getTitreFoncier(),
            site: $terrain->getSite(),
            situation: $terrain->getSituation(),
            topographie: $terrain->getTopographie(),
        );
    }
}
