<?php

declare(strict_types=1);

namespace App\Domain\Piece\Repository;

use App\Domain\Piece\Entity\Piece;

interface PieceRepositoryInterface
{
    public function getById(string $id): ?Piece;
    /** @return list<Piece> */
    public function listAll(): array;

    public function createCustom(string $designation, float $surfaceStandard): Piece;
}
