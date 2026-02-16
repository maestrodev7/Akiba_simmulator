<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Infrastructure\Persistence\Eloquent\PieceModel;
use Illuminate\Database\Seeder;

/**
 * Référentiel des pièces (PDF tableau §5).
 */
class PieceCatalogueSeeder extends Seeder
{
    public function run(): void
    {
        $pieces = [
            ['designation' => 'Séjour', 'surface_standard' => 30, 'ordre' => 1],
            ['designation' => 'Salle à manger', 'surface_standard' => 20, 'ordre' => 2],
            ['designation' => 'Cuisine', 'surface_standard' => 15, 'ordre' => 3],
            ['designation' => 'Suite parentale', 'surface_standard' => 18, 'ordre' => 4],
            ['designation' => 'Chambre', 'surface_standard' => 12, 'ordre' => 5],
            ['designation' => 'WC / Toilettes', 'surface_standard' => 4, 'ordre' => 6],
            ['designation' => 'Bureau', 'surface_standard' => 12, 'ordre' => 7],
            ['designation' => 'Salle de bain', 'surface_standard' => 5, 'ordre' => 8],
            ['designation' => 'Magasin', 'surface_standard' => 10, 'ordre' => 9],
            ['designation' => 'Salon', 'surface_standard' => 15, 'ordre' => 10],
            ['designation' => 'Garage', 'surface_standard' => 20, 'ordre' => 11],
            ['designation' => 'Terrasse', 'surface_standard' => 15, 'ordre' => 12],
            ['designation' => 'Véranda', 'surface_standard' => 10, 'ordre' => 13],
            ['designation' => 'Balcon', 'surface_standard' => 5, 'ordre' => 14],
            ['designation' => 'Autres', 'surface_standard' => 10, 'ordre' => 15],
        ];

        foreach ($pieces as $p) {
            PieceModel::firstOrCreate(
                ['designation' => $p['designation']],
                ['id' => PieceModel::generateShortId(), 'surface_standard' => $p['surface_standard'], 'ordre' => $p['ordre']]
            );
        }
    }
}
