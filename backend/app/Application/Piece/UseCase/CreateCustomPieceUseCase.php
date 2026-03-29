<?php

declare(strict_types=1);

namespace App\Application\Piece\UseCase;

use App\Domain\Piece\Entity\Piece;
use App\Domain\Piece\Repository\PieceRepositoryInterface;

final class CreateCustomPieceUseCase
{
    public function __construct(
        private readonly PieceRepositoryInterface $pieceRepository,
    ) {
    }

    /** @return array{id: string, designation: string, surface_standard: float, ordre: int, is_custom: bool} */
    public function execute(string $designation, float $surfaceStandard): array
    {
        $piece = $this->pieceRepository->createCustom($designation, $surfaceStandard);

        return $this->toArray($piece);
    }

    /** @return array{id: string, designation: string, surface_standard: float, ordre: int, is_custom: bool} */
    private function toArray(Piece $p): array
    {
        return [
            'id' => $p->getId(),
            'designation' => $p->getDesignation(),
            'surface_standard' => $p->getSurfaceStandard(),
            'ordre' => $p->getOrdre(),
            'is_custom' => $p->isCustom(),
        ];
    }
}
