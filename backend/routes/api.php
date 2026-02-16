<?php

use App\Presentation\Http\Controller\Api\ClientController;
use App\Presentation\Http\Controller\Api\PieceController;
use App\Presentation\Http\Controller\Api\ProduitController;
use App\Presentation\Http\Controller\Api\ProgrammeController;
use App\Presentation\Http\Controller\Api\SimulationController;
use App\Presentation\Http\Controller\Api\TerrainController;
use Illuminate\Support\Facades\Route;

Route::apiResource('clients', ClientController::class);

Route::get('pieces', [PieceController::class, 'index']);

Route::prefix('clients/{clientId}')->group(function (): void {
    Route::apiResource('terrains', TerrainController::class)->except(['destroy']);

    Route::prefix('terrains/{terrainId}')->group(function (): void {
        Route::get('produits', [ProduitController::class, 'index']);
        Route::post('produits', [ProduitController::class, 'store']);
        Route::get('produits/{produit}', [ProduitController::class, 'show']);
        Route::put('produits/{produit}', [ProduitController::class, 'update']);

        Route::prefix('produits/{produit}')->group(function (): void {
            Route::get('programme', [ProgrammeController::class, 'index']);
            Route::post('programme', [ProgrammeController::class, 'store']);
            Route::put('programme/{ligneId}', [ProgrammeController::class, 'update']);
            Route::get('simulation', [SimulationController::class, 'show']);
        });
    });
});
