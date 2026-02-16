<?php

declare(strict_types=1);

namespace App\Application\Produit\Dto;

final class ProduitDto
{
    public function __construct(
        public readonly ?string $typeProduit = null,
        public readonly ?string $materiaux = null,
        public readonly ?string $standing = null,
        public readonly ?float $budgetPrevisionnel = null,
        public readonly ?string $dateDebutTravaux = null,
        public readonly ?string $dateFinTravaux = null,
        public readonly ?array $caracteristiques = null,
    ) {
    }

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data): self
    {
        $carac = $data['caracteristiques'] ?? null;
        return new self(
            typeProduit: isset($data['type_produit']) ? (string) $data['type_produit'] : null,
            materiaux: isset($data['materiaux']) ? (string) $data['materiaux'] : null,
            standing: isset($data['standing']) ? (string) $data['standing'] : null,
            budgetPrevisionnel: isset($data['budget_previsionnel']) ? (float) $data['budget_previsionnel'] : null,
            dateDebutTravaux: isset($data['date_debut_travaux']) ? (string) $data['date_debut_travaux'] : null,
            dateFinTravaux: isset($data['date_fin_travaux']) ? (string) $data['date_fin_travaux'] : null,
            caracteristiques: is_array($carac) ? $carac : null,
        );
    }
}
