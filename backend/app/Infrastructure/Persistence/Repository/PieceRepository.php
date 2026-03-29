<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Repository;

use App\Domain\Piece\Entity\Piece;
use App\Domain\Piece\Repository\PieceRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\PieceModel;

final class PieceRepository implements PieceRepositoryInterface
{
    public function getById(string $id): ?Piece
    {
        $model = PieceModel::find($id);
        return $model ? $this->toEntity($model) : null;
    }

    /** @return list<Piece> */
    public function listAll(): array
    {
        return PieceModel::query()
            ->orderBy('is_custom')
            ->orderBy('ordre')
            ->orderBy('designation')
            ->get()
            ->map(fn (PieceModel $m) => $this->toEntity($m))
            ->all();
    }

    public function createCustom(string $designation, float $surfaceStandard): Piece
    {
        $maxOrdre = (int) PieceModel::query()->max('ordre');
        $model = new PieceModel();
        $model->designation = trim($designation);
        $model->surface_standard = $surfaceStandard;
        $model->ordre = $maxOrdre + 1;
        $model->is_custom = true;
        $model->save();

        return $this->toEntity($model);
    }

    private function toEntity(PieceModel $m): Piece
    {
        return new Piece(
            id: $m->id,
            designation: $m->designation,
            surfaceStandard: (float) $m->surface_standard,
            ordre: (int) $m->ordre,
            isCustom: (bool) ($m->is_custom ?? false),
        );
    }
}
