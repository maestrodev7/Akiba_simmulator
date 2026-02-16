<?php

declare(strict_types=1);

namespace App\Domain\Programme\Entity;

/** Une ligne du programme : produit + pièce + nombre + surface personnalisée optionnelle. */
final class LigneProgramme
{
    public function __construct(
        private string $id,
        private string $produitId,
        private string $pieceId,
        private int $nombre,
        private ?float $surfacePersonnalisee = null,
    ) {
    }

    public function getId(): string { return $this->id; }
    public function getProduitId(): string { return $this->produitId; }
    public function getPieceId(): string { return $this->pieceId; }
    public function getNombre(): int { return $this->nombre; }
    public function getSurfacePersonnalisee(): ?float { return $this->surfacePersonnalisee; }

    public function withNombre(int $v): self { $c = clone $this; $c->nombre = $v; return $c; }
    public function withSurfacePersonnalisee(?float $v): self { $c = clone $this; $c->surfacePersonnalisee = $v; return $c; }
}
