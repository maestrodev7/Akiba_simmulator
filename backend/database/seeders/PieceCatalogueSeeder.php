<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Infrastructure\Persistence\Eloquent\PieceModel;
use Illuminate\Database\Seeder;

/**
 * Catalogue par défaut (wizard simulateur, aligné fiche programme / estimation SP).
 * Surfaces standards indicatives pour le calcul Total = SP × Prix/m² × Indice.
 */
class PieceCatalogueSeeder extends Seeder
{
    public function run(): void
    {
        $pieces = [
            ['designation' => 'Pièce de séjour', 'surface_standard' => 30, 'ordre' => 1],
            ['designation' => 'Salle à manger', 'surface_standard' => 20, 'ordre' => 2],
            ['designation' => 'Salon', 'surface_standard' => 25, 'ordre' => 3],
            ['designation' => 'Cuisine', 'surface_standard' => 15, 'ordre' => 4],
            ['designation' => 'Suite parentale', 'surface_standard' => 18, 'ordre' => 5],
            ['designation' => 'Chambre', 'surface_standard' => 12, 'ordre' => 6],
            ['designation' => 'Toilettes', 'surface_standard' => 4, 'ordre' => 7],
            ['designation' => 'WC', 'surface_standard' => 2, 'ordre' => 8],
            ['designation' => 'Salle de bain', 'surface_standard' => 8, 'ordre' => 9],
            ['designation' => 'Bureau', 'surface_standard' => 12, 'ordre' => 10],
            ['designation' => 'Réserve', 'surface_standard' => 8, 'ordre' => 11],
            ['designation' => 'Véranda', 'surface_standard' => 12, 'ordre' => 12],
            ['designation' => 'Terrasse', 'surface_standard' => 15, 'ordre' => 13],
            ['designation' => 'Balcon', 'surface_standard' => 8, 'ordre' => 14],
            ['designation' => 'Autres', 'surface_standard' => 10, 'ordre' => 15],
        ];

        foreach ($pieces as $p) {
            PieceModel::updateOrCreate(
                ['designation' => $p['designation']],
                [
                    'surface_standard' => $p['surface_standard'],
                    'ordre' => $p['ordre'],
                    'is_custom' => false,
                ],
            );
        }
    }
}
