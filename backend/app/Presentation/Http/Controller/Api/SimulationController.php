<?php

declare(strict_types=1);

namespace App\Presentation\Http\Controller\Api;

use App\Application\Simulation\UseCase\CalculerSimulationUseCase;
use App\Http\Controllers\Controller;
use App\Presentation\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Simulation financière (PDF §6). Total = SP × Prix/m² × Indice.
 */
final class SimulationController extends Controller
{
    public function __construct(
        private readonly CalculerSimulationUseCase $calculerSimulationUseCase,
    ) {
    }

    public function show(string $clientId, string $terrainId, string $produit): JsonResponse
    {
        $result = $this->calculerSimulationUseCase->execute($produit);
        return ApiResponse::success([
            'surface_plancher_totale_m2' => $result->surfacePlancherTotale,
            'prix_par_m2' => $result->prixParM2,
            'indice_materiaux' => $result->indiceMateriaux,
            'cout_total_eur' => $result->coutTotal,
            'budget_previsionnel_eur' => $result->budgetPrevisionnel,
            'lignes' => $result->lignes,
        ]);
    }
}
