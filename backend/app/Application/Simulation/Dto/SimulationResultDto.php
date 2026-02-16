<?php

declare(strict_types=1);

namespace App\Application\Simulation\Dto;

/**
 * Résultat de la simulation financière (PDF §6.1).
 * Total = SP × Prix/m² × Indice matériaux.
 */
final class SimulationResultDto
{
    public function __construct(
        public readonly float $surfacePlancherTotale,  // SP en m²
        public readonly float $prixParM2,               // 305 | 475 | 610
        public readonly float $indiceMateriaux,         // 1 | 0.75 | 0.65
        public readonly float $coutTotal,               // Total en €
        public readonly ?float $budgetPrevisionnel,
        public readonly array $lignes,                  // détail par pièce
    ) {
    }
}
