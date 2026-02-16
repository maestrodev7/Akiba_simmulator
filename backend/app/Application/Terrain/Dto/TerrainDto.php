<?php

declare(strict_types=1);

namespace App\Application\Terrain\Dto;

final class TerrainDto
{
    public function __construct(
        public readonly ?string $adresse = null,
        public readonly ?float $superficie = null,
        public readonly ?string $titreFoncier = null,
        public readonly ?string $site = null,
        public readonly ?string $situation = null,
        public readonly ?string $topographie = null,
    ) {
    }

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data): self
    {
        return new self(
            adresse: isset($data['adresse']) ? (string) $data['adresse'] : null,
            superficie: isset($data['superficie']) ? (float) $data['superficie'] : null,
            titreFoncier: isset($data['titre_foncier']) ? (string) $data['titre_foncier'] : null,
            site: isset($data['site']) ? (string) $data['site'] : null,
            situation: isset($data['situation']) ? (string) $data['situation'] : null,
            topographie: isset($data['topographie']) ? (string) $data['topographie'] : null,
        );
    }
}
