<?php

declare(strict_types=1);

namespace App\Application\Piece\UseCase;

use App\Domain\Piece\Entity\Piece;
use App\Domain\Piece\Repository\PieceRepositoryInterface;

final class ListPiecesUseCase
{
    public function __construct(
        private readonly PieceRepositoryInterface $pieceRepository,
    ) {
    }

    /** @return list<array{id: string, designation: string, surface_standard: float, ordre: int}> */
    public function execute(): array
    {
        $pieces = $this->pieceRepository->listAll();
        return array_map(fn (Piece $p) => [
            'id' => $p->getId(),
            'designation' => $p->getDesignation(),
            'surface_standard' => $p->getSurfaceStandard(),
            'ordre' => $p->getOrdre(),
        ], $pieces);
    }
}
