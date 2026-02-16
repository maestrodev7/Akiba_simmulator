<?php

declare(strict_types=1);

namespace App\Domain\Produit\Entity;

final class Produit
{
    /** Standing: standard=305, moyen=475, haut=610 €/m². Indice matériaux: parpaings=1, brique=0.75, bois=0.65 */
    public function __construct(
        private string $id,
        private string $terrainId,
        private ?string $typeProduit = null,
        private ?string $materiaux = null,
        private ?string $standing = null,
        private ?float $budgetPrevisionnel = null,
        private ?string $dateDebutTravaux = null,
        private ?string $dateFinTravaux = null,
        private ?array $caracteristiques = null,
    ) {
    }

    public function getId(): string { return $this->id; }
    public function getTerrainId(): string { return $this->terrainId; }
    public function getTypeProduit(): ?string { return $this->typeProduit; }
    public function getMateriaux(): ?string { return $this->materiaux; }
    public function getStanding(): ?string { return $this->standing; }
    public function getBudgetPrevisionnel(): ?float { return $this->budgetPrevisionnel; }
    public function getDateDebutTravaux(): ?string { return $this->dateDebutTravaux; }
    public function getDateFinTravaux(): ?string { return $this->dateFinTravaux; }
    /** @return array<string, mixed>|null */
    public function getCaracteristiques(): ?array { return $this->caracteristiques; }

    public function withTypeProduit(?string $v): self { $c = clone $this; $c->typeProduit = $v; return $c; }
    public function withMateriaux(?string $v): self { $c = clone $this; $c->materiaux = $v; return $c; }
    public function withStanding(?string $v): self { $c = clone $this; $c->standing = $v; return $c; }
    public function withBudgetPrevisionnel(?float $v): self { $c = clone $this; $c->budgetPrevisionnel = $v; return $c; }
    public function withDateDebutTravaux(?string $v): self { $c = clone $this; $c->dateDebutTravaux = $v; return $c; }
    public function withDateFinTravaux(?string $v): self { $c = clone $this; $c->dateFinTravaux = $v; return $c; }
    /** @param array<string, mixed>|null $v */
    public function withCaracteristiques(?array $v): self { $c = clone $this; $c->caracteristiques = $v; return $c; }
}
