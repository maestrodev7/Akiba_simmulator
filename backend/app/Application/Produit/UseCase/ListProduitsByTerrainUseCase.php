<?php

declare(strict_types=1);

namespace App\Application\Produit\UseCase;

use App\Application\Produit\Dto\ProduitResourceDto;
use App\Domain\Produit\Entity\Produit;
use App\Domain\Produit\Repository\ProduitRepositoryInterface;

final class ListProduitsByTerrainUseCase
{
    public function __construct(
        private readonly ProduitRepositoryInterface $produitRepository,
    ) {
    }

    /** @return list<ProduitResourceDto> */
    public function execute(string $terrainId): array
    {
        $produits = $this->produitRepository->getByTerrainId($terrainId);
        return array_map(fn (Produit $p) => new ProduitResourceDto(
            id: $p->getId(),
            terrainId: $p->getTerrainId(),
            typeProduit: $p->getTypeProduit(),
            materiaux: $p->getMateriaux(),
            standing: $p->getStanding(),
            budgetPrevisionnel: $p->getBudgetPrevisionnel(),
            dateDebutTravaux: $p->getDateDebutTravaux(),
            dateFinTravaux: $p->getDateFinTravaux(),
            caracteristiques: $p->getCaracteristiques(),
        ), $produits);
    }
}
