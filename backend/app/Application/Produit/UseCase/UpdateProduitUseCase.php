<?php

declare(strict_types=1);

namespace App\Application\Produit\UseCase;

use App\Application\Produit\Dto\ProduitDto;
use App\Application\Produit\Dto\ProduitResourceDto;
use App\Domain\Exception\NotFoundException;
use App\Domain\Produit\Entity\Produit;
use App\Domain\Produit\Repository\ProduitRepositoryInterface;

final class UpdateProduitUseCase
{
    public function __construct(
        private readonly ProduitRepositoryInterface $produitRepository,
    ) {
    }

    public function execute(string $id, ProduitDto $dto): ProduitResourceDto
    {
        $produit = $this->produitRepository->getById($id);
        if ($produit === null) {
            throw new NotFoundException('Produit non trouvé.');
        }
        if ($dto->typeProduit !== null) $produit = $produit->withTypeProduit($dto->typeProduit);
        if ($dto->materiaux !== null) $produit = $produit->withMateriaux($dto->materiaux);
        if ($dto->standing !== null) $produit = $produit->withStanding($dto->standing);
        if ($dto->budgetPrevisionnel !== null) $produit = $produit->withBudgetPrevisionnel($dto->budgetPrevisionnel);
        if ($dto->dateDebutTravaux !== null) $produit = $produit->withDateDebutTravaux($dto->dateDebutTravaux);
        if ($dto->dateFinTravaux !== null) $produit = $produit->withDateFinTravaux($dto->dateFinTravaux);
        if ($dto->caracteristiques !== null) $produit = $produit->withCaracteristiques($dto->caracteristiques);
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
