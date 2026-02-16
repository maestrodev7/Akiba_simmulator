<?php

namespace App\Providers;

use App\Domain\Client\Repository\ClientRepositoryInterface;
use App\Infrastructure\Persistence\Repository\ClientRepository;
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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
