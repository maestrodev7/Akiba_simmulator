<?php

declare(strict_types=1);

namespace App\Application\Terrain\UseCase;

use App\Application\Terrain\Dto\TerrainDto;
use App\Application\Terrain\Support\SuperficieConverter;
use App\Application\Terrain\Dto\TerrainResourceDto;
use App\Domain\Exception\NotFoundException;
use App\Domain\Terrain\Entity\Terrain;
use App\Domain\Terrain\Repository\TerrainRepositoryInterface;

final class UpdateTerrainUseCase
{
    public function __construct(
        private readonly TerrainRepositoryInterface $terrainRepository,
    ) {
    }

    public function execute(string $id, TerrainDto $dto): TerrainResourceDto
    {
        $terrain = $this->terrainRepository->getById($id);
        if ($terrain === null) {
            throw new NotFoundException('Terrain non trouvé.');
        }
        if ($dto->adresse !== null) $terrain = $terrain->withAdresse($dto->adresse);
        if ($dto->superficie !== null) {
            $unite = SuperficieConverter::normalizeUnit($dto->superficieUnite ?? $terrain->getSuperficieUnite());
            $terrain = $terrain
                ->withSuperficie(SuperficieConverter::toSquareMeters($dto->superficie, $unite))
                ->withSuperficieUnite($unite);
        } elseif ($dto->superficieUnite !== null) {
            $terrain = $terrain->withSuperficieUnite(SuperficieConverter::normalizeUnit($dto->superficieUnite));
        }
        if ($dto->titreFoncier !== null) $terrain = $terrain->withTitreFoncier($dto->titreFoncier);
        if ($dto->site !== null) $terrain = $terrain->withSite($dto->site);
        if ($dto->situation !== null) $terrain = $terrain->withSituation($dto->situation);
        if ($dto->topographie !== null) $terrain = $terrain->withTopographie($dto->topographie);
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
            superficieUnite: $t->getSuperficieUnite(),
            titreFoncier: $t->getTitreFoncier(),
            site: $t->getSite(),
            situation: $t->getSituation(),
            topographie: $t->getTopographie(),
        );
    }
}
