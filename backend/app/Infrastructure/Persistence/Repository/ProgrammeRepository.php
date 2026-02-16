<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Repository;

use App\Domain\Programme\Entity\LigneProgramme;
use App\Domain\Programme\Repository\ProgrammeRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\ProgrammeModel;

final class ProgrammeRepository implements ProgrammeRepositoryInterface
{
    public function nextIdentity(): string
    {
        do {
            $id = ProgrammeModel::generateShortId();
        } while (ProgrammeModel::where('id', $id)->exists());
        return $id;
    }

    public function save(LigneProgramme $ligne): void
    {
        $model = ProgrammeModel::firstOrNew(['id' => $ligne->getId()]);
        $model->produit_id = $ligne->getProduitId();
        $model->piece_id = $ligne->getPieceId();
        $model->nombre = $ligne->getNombre();
        $model->surface_personnalisee = $ligne->getSurfacePersonnalisee();
        $model->save();
    }

    public function getById(string $id): ?LigneProgramme
    {
        $model = ProgrammeModel::find($id);
        return $model ? $this->toEntity($model) : null;
    }

    /** @return list<LigneProgramme> */
    public function getByProduitId(string $produitId): array
    {
        return ProgrammeModel::where('produit_id', $produitId)->get()
            ->map(fn (ProgrammeModel $m) => $this->toEntity($m))->all();
    }

    public function delete(string $id): bool
    {
        return ProgrammeModel::where('id', $id)->delete() > 0;
    }

    public function deleteByProduitId(string $produitId): void
    {
        ProgrammeModel::where('produit_id', $produitId)->delete();
    }

    private function toEntity(ProgrammeModel $m): LigneProgramme
    {
        return new LigneProgramme(
            id: $m->id,
            produitId: $m->produit_id,
            pieceId: $m->piece_id,
            nombre: $m->nombre,
            surfacePersonnalisee: $m->surface_personnalisee,
        );
    }
}
