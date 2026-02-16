<?php

declare(strict_types=1);

namespace App\Domain\Piece\Entity;

/** Pièce du catalogue (référentiel). */
final class Piece
{
    public function __construct(
        private string $id,
        private string $designation,
        private float $surfaceStandard,
        private int $ordre = 0,
    ) {
    }

    public function getId(): string { return $this->id; }
    public function getDesignation(): string { return $this->designation; }
    public function getSurfaceStandard(): float { return $this->surfaceStandard; }
    public function getOrdre(): int { return $this->ordre; }
}
