<?php

declare(strict_types=1);

namespace App\Application\Produit\UseCase;

use App\Application\Produit\Dto\ProduitResourceDto;
use App\Domain\Exception\NotFoundException;
use App\Domain\Produit\Repository\ProduitRepositoryInterface;

final class GetProduitUseCase
{
    public function __construct(
        private readonly ProduitRepositoryInterface $produitRepository,
    ) {
    }

    public function execute(string $id): ProduitResourceDto
    {
        $produit = $this->produitRepository->getById($id);
        if ($produit === null) {
            throw new NotFoundException('Produit non trouvé.');
        }
        return new ProduitResourceDto(
            id: $produit->getId(),
            terrainId: $produit->getTerrainId(),
            typeProduit: $produit->getTypeProduit(),
            materiaux: $produit->getMateriaux(),
            standing: $produit->getStanding(),
            budgetPrevisionnel: $produit->getBudgetPrevisionnel(),
            dateDebutTravaux: $produit->getDateDebutTravaux(),
            dateFinTravaux: $produit->getDateFinTravaux(),
            caracteristiques: $produit->getCaracteristiques(),
        );
    }
}
