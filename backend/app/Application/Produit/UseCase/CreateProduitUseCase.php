<?php

declare(strict_types=1);

namespace App\Application\Produit\UseCase;

use App\Application\Produit\Dto\ProduitDto;
use App\Application\Produit\Dto\ProduitResourceDto;
use App\Domain\Exception\NotFoundException;
use App\Domain\Produit\Entity\Produit;
use App\Domain\Produit\Repository\ProduitRepositoryInterface;
use App\Domain\Terrain\Repository\TerrainRepositoryInterface;

final class CreateProduitUseCase
{
    public function __construct(
        private readonly ProduitRepositoryInterface $produitRepository,
        private readonly TerrainRepositoryInterface $terrainRepository,
    ) {
    }

    public function execute(string $terrainId, ProduitDto $dto): ProduitResourceDto
    {
        if ($this->terrainRepository->getById($terrainId) === null) {
            throw new NotFoundException('Terrain non trouvé.');
        }
        $id = $this->produitRepository->nextIdentity();
        $produit = new Produit(
            id: $id,
            terrainId: $terrainId,
            typeProduit: $dto->typeProduit,
            materiaux: $dto->materiaux,
            standing: $dto->standing,
            budgetPrevisionnel: $dto->budgetPrevisionnel,
            dateDebutTravaux: $dto->dateDebutTravaux,
            dateFinTravaux: $dto->dateFinTravaux,
            caracteristiques: $dto->caracteristiques,
        );
        $this->produitRepository->save($produit);
        return $this->toResource($produit);
    }

    private function toResource(Produit $p): ProduitResourceDto
    {
        return new ProduitResourceDto(
            id: $p->getId(),
            terrainId: $p->getTerrainId(),
            typeProduit: $p->getTypeProduit(),
            materiaux: $p->getMateriaux(),
            standing: $p->getStanding(),
            budgetPrevisionnel: $p->getBudgetPrevisionnel(),
            dateDebutTravaux: $p->getDateDebutTravaux(),
            dateFinTravaux: $p->getDateFinTravaux(),
            caracteristiques: $p->getCaracteristiques(),
        );
    }
}
