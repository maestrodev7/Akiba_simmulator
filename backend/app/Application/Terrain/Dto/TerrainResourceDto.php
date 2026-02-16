<?php

declare(strict_types=1);

namespace App\Application\Terrain\Dto;

final class TerrainResourceDto
{
    public function __construct(
        public readonly string $id,
        public readonly string $clientId,
        public readonly ?string $adresse = null,
        public readonly ?float $superficie = null,
        public readonly ?string $titreFoncier = null,
        public readonly ?string $site = null,
        public readonly ?string $situation = null,
        public readonly ?string $topographie = null,
    ) {
    }
}
