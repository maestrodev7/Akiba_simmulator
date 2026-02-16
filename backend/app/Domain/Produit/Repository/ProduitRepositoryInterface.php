<?php

declare(strict_types=1);

namespace App\Domain\Produit\Repository;

use App\Domain\Produit\Entity\Produit;

interface ProduitRepositoryInterface
{
    public function nextIdentity(): string;
    public function save(Produit $produit): void;
    public function getById(string $id): ?Produit;
    /** @return list<Produit> */
    public function getByTerrainId(string $terrainId): array;
    /** @return array{items: list<Produit>, total: int} */
    public function getPaginated(int $page, int $perPage): array;
    public function delete(string $id): bool;
}
