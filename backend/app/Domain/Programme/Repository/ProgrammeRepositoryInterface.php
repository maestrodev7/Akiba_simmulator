<?php

declare(strict_types=1);

namespace App\Domain\Programme\Repository;

use App\Domain\Programme\Entity\LigneProgramme;

interface ProgrammeRepositoryInterface
{
    public function nextIdentity(): string;
    public function save(LigneProgramme $ligne): void;
    public function getById(string $id): ?LigneProgramme;
    /** @return list<LigneProgramme> */
    public function getByProduitId(string $produitId): array;
    public function delete(string $id): bool;
    public function deleteByProduitId(string $produitId): void;
}
