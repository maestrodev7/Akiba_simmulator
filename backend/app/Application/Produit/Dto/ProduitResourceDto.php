<?php

declare(strict_types=1);

namespace App\Application\Produit\Dto;

final class ProduitResourceDto
{
    public function __construct(
        public readonly string $id,
        public readonly string $terrainId,
        public readonly ?string $typeProduit = null,
        public readonly ?string $materiaux = null,
        public readonly ?string $standing = null,
        public readonly ?float $budgetPrevisionnel = null,
        public readonly ?string $dateDebutTravaux = null,
        public readonly ?string $dateFinTravaux = null,
        public readonly ?array $caracteristiques = null,
    ) {
    }
}
