<?php

declare(strict_types=1);

namespace App\Application\Programme\UseCase;

use App\Domain\Piece\Repository\PieceRepositoryInterface;
use App\Domain\Programme\Entity\LigneProgramme;
use App\Domain\Programme\Repository\ProgrammeRepositoryInterface;

final class ListLignesByProduitUseCase
{
    public function __construct(
        private readonly ProgrammeRepositoryInterface $programmeRepository,
        private readonly PieceRepositoryInterface $pieceRepository,
    ) {
    }

    /**
     * @return list<array{id: string, produit_id: string, piece_id: string, piece_designation: string, surface_standard: float, nombre: int, surface_personnalisee: ?float, surface_totale: float}>
     */
    public function execute(string $produitId): array
    {
        $lignes = $this->programmeRepository->getByProduitId($produitId);
        $result = [];
        foreach ($lignes as $ligne) {
            $piece = $this->pieceRepository->getById($ligne->getPieceId());
            $surfaceStandard = $piece !== null ? $piece->getSurfaceStandard() : 0.0;
            $surfaceUnitaire = $ligne->getSurfacePersonnalisee() ?? $surfaceStandard;
            $surfaceTotale = $surfaceUnitaire * $ligne->getNombre();
            $result[] = [
                'id' => $ligne->getId(),
                'produit_id' => $ligne->getProduitId(),
                'piece_id' => $ligne->getPieceId(),
                'piece_designation' => $piece !== null ? $piece->getDesignation() : '',
                'surface_standard' => $surfaceStandard,
                'nombre' => $ligne->getNombre(),
                'surface_personnalisee' => $ligne->getSurfacePersonnalisee(),
                'surface_totale' => $surfaceTotale,
            ];
        }
        return $result;
    }
}
