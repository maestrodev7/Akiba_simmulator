<?php

declare(strict_types=1);

namespace App\Application\Simulation\UseCase;

use App\Application\Simulation\Dto\SimulationResultDto;
use App\Domain\Exception\NotFoundException;
use App\Domain\Piece\Repository\PieceRepositoryInterface;
use App\Domain\Produit\Repository\ProduitRepositoryInterface;
use App\Domain\Programme\Repository\ProgrammeRepositoryInterface;

/**
 * Calcule l'estimation financière selon le PDF : Total = SP × Prix/m² × Indice.
 * Standing : standard=305, moyen=475, haut=610 €/m².
 * Indice matériaux : parpaings/béton=1, brique=0.75, bois=0.65.
 */
final class CalculerSimulationUseCase
{
    private const PRIX_PAR_STANDING = [
        'standard' => 305.0,
        'moyen' => 475.0,
        'haut' => 610.0,
    ];

    private const INDICE_MATERIAUX = [
        'parpaings' => 1.0,
        'beton' => 1.0,
        'brique' => 0.75,
        'bois' => 0.65,
    ];

    public function __construct(
        private readonly ProduitRepositoryInterface $produitRepository,
        private readonly ProgrammeRepositoryInterface $programmeRepository,
        private readonly PieceRepositoryInterface $pieceRepository,
    ) {
    }

    public function execute(string $produitId): SimulationResultDto
    {
        $produit = $this->produitRepository->getById($produitId);
        if ($produit === null) {
            throw new NotFoundException('Produit non trouvé.');
        }

        $lignes = $this->programmeRepository->getByProduitId($produitId);
        $sp = 0.0;
        $lignesDetail = [];

        foreach ($lignes as $ligne) {
            $piece = $this->pieceRepository->getById($ligne->getPieceId());
            $surfaceStandard = $piece !== null ? $piece->getSurfaceStandard() : 0.0;
            $surfaceUnitaire = $ligne->getSurfacePersonnalisee() ?? $surfaceStandard;
            $surfaceTotale = $surfaceUnitaire * $ligne->getNombre();
            $sp += $surfaceTotale;
            $lignesDetail[] = [
                'piece_id' => $ligne->getPieceId(),
                'piece_designation' => $piece !== null ? $piece->getDesignation() : '',
                'nombre' => $ligne->getNombre(),
                'surface_unitaire' => $surfaceUnitaire,
                'surface_totale' => $surfaceTotale,
            ];
        }

        $standingKey = $this->normalizeStanding($produit->getStanding());
        $prixM2 = self::PRIX_PAR_STANDING[$standingKey] ?? 305.0;

        $materiauxKey = $this->normalizeMateriaux($produit->getMateriaux());
        $indice = self::INDICE_MATERIAUX[$materiauxKey] ?? 1.0;

        $coutTotal = $sp * $prixM2 * $indice;

        return new SimulationResultDto(
            surfacePlancherTotale: $sp,
            prixParM2: $prixM2,
            indiceMateriaux: $indice,
            coutTotal: round($coutTotal, 2),
            budgetPrevisionnel: $produit->getBudgetPrevisionnel(),
            lignes: $lignesDetail,
        );
    }

    private function normalizeStanding(?string $s): string
    {
        if ($s === null) return 'standard';
        $k = strtolower(trim($s));
        if (in_array($k, ['standard', 'moyen', 'haut'], true)) return $k;
        if (str_contains($k, 'moyen')) return 'moyen';
        if (str_contains($k, 'haut')) return 'haut';
        return 'standard';
    }

    private function normalizeMateriaux(?string $s): string
    {
        if ($s === null) return 'parpaings';
        $k = strtolower(trim($s));
        if (str_contains($k, 'bois')) return 'bois';
        if (str_contains($k, 'brique')) return 'brique';
        return 'parpaings';
    }
}
