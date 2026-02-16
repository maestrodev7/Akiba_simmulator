<?php

declare(strict_types=1);

namespace App\Application\Terrain\UseCase;

use App\Application\Terrain\Dto\TerrainDto;
use App\Application\Terrain\Dto\TerrainResourceDto;
use App\Domain\Client\Repository\ClientRepositoryInterface;
use App\Domain\Exception\NotFoundException;
use App\Domain\Terrain\Entity\Terrain;
use App\Domain\Terrain\Repository\TerrainRepositoryInterface;

final class CreateTerrainUseCase
{
    public function __construct(
        private readonly TerrainRepositoryInterface $terrainRepository,
        private readonly ClientRepositoryInterface $clientRepository,
    ) {
    }

    public function execute(string $clientId, TerrainDto $dto): TerrainResourceDto
    {
        if ($this->clientRepository->getById($clientId) === null) {
            throw new NotFoundException('Client non trouvé.');
        }
        $id = $this->terrainRepository->nextIdentity();
        $terrain = new Terrain(
            id: $id,
            clientId: $clientId,
            adresse: $dto->adresse,
            superficie: $dto->superficie,
            titreFoncier: $dto->titreFoncier,
            site: $dto->site,
            situation: $dto->situation,
            topographie: $dto->topographie,
        );
        $this->terrainRepository->save($terrain);
        return $this->toResource($terrain);
    }

    private function toResource(Terrain $t): TerrainResourceDto
    {
        return new TerrainResourceDto(
            id: $t->getId(),
            clientId: $t->getClientId(),
            adresse: $t->getAdresse(),
            superficie: $t->getSuperficie(),
            titreFoncier: $t->getTitreFoncier(),
            site: $t->getSite(),
            situation: $t->getSituation(),
            topographie: $t->getTopographie(),
        );
    }
}
