<?php

declare(strict_types=1);

namespace App\Domain\Terrain\Repository;

use App\Domain\Terrain\Entity\Terrain;

interface TerrainRepositoryInterface
{
    public function nextIdentity(): string;
    public function save(Terrain $terrain): void;
    public function getById(string $id): ?Terrain;
    /** @return list<Terrain> */
    public function getByClientId(string $clientId): array;
    /** @return array{items: list<Terrain>, total: int} */
    public function getPaginated(int $page, int $perPage): array;
    public function delete(string $id): bool;
}
