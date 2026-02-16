<?php

namespace App\Providers;

use App\Domain\Client\Repository\ClientRepositoryInterface;
use App\Domain\Piece\Repository\PieceRepositoryInterface;
use App\Domain\Produit\Repository\ProduitRepositoryInterface;
use App\Domain\Programme\Repository\ProgrammeRepositoryInterface;
use App\Domain\Terrain\Repository\TerrainRepositoryInterface;
use App\Infrastructure\Persistence\Repository\ClientRepository;
use App\Infrastructure\Persistence\Repository\PieceRepository;
use App\Infrastructure\Persistence\Repository\ProduitRepository;
use App\Infrastructure\Persistence\Repository\ProgrammeRepository;
use App\Infrastructure\Persistence\Repository\TerrainRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     * Les interfaces du Domaine sont liées aux implémentations de l'Infrastructure.
     */
    public function register(): void
    {
        $this->app->bind(ClientRepositoryInterface::class, ClientRepository::class);
        $this->app->bind(TerrainRepositoryInterface::class, TerrainRepository::class);
        $this->app->bind(ProduitRepositoryInterface::class, ProduitRepository::class);
        $this->app->bind(PieceRepositoryInterface::class, PieceRepository::class);
        $this->app->bind(ProgrammeRepositoryInterface::class, ProgrammeRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
