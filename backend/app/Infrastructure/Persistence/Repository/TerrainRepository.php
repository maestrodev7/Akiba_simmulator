<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Repository;

use App\Domain\Terrain\Entity\Terrain;
use App\Domain\Terrain\Repository\TerrainRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\TerrainModel;

final class TerrainRepository implements TerrainRepositoryInterface
{
    public function nextIdentity(): string
    {
        do {
            $id = TerrainModel::generateShortId();
        } while (TerrainModel::where('id', $id)->exists());
        return $id;
    }

    public function save(Terrain $terrain): void
    {
        $model = TerrainModel::firstOrNew(['id' => $terrain->getId()]);
        $model->client_id = $terrain->getClientId();
        $model->adresse = $terrain->getAdresse();
        $model->superficie = $terrain->getSuperficie();
        $model->titre_foncier = $terrain->getTitreFoncier();
        $model->site = $terrain->getSite();
        $model->situation = $terrain->getSituation();
        $model->topographie = $terrain->getTopographie();
        $model->save();
    }

    public function getById(string $id): ?Terrain
    {
        $model = TerrainModel::find($id);
        return $model ? $this->toEntity($model) : null;
    }

    /** @return list<Terrain> */
    public function getByClientId(string $clientId): array
    {
        return TerrainModel::where('client_id', $clientId)->orderBy('created_at')->get()
            ->map(fn (TerrainModel $m) => $this->toEntity($m))->all();
    }

    /** @return array{items: list<Terrain>, total: int} */
    public function getPaginated(int $page, int $perPage): array
    {
        $query = TerrainModel::query()->orderBy('created_at', 'desc');
        $total = $query->count();
        $items = $query->offset(($page - 1) * $perPage)->limit($perPage)->get()
            ->map(fn (TerrainModel $m) => $this->toEntity($m))->all();
        return ['items' => $items, 'total' => $total];
    }

    public function delete(string $id): bool
    {
        return TerrainModel::where('id', $id)->delete() > 0;
    }

    private function toEntity(TerrainModel $m): Terrain
    {
        return new Terrain(
            id: $m->id,
            clientId: $m->client_id,
            adresse: $m->adresse,
            superficie: $m->superficie,
            titreFoncier: $m->titre_foncier,
            site: $m->site,
            situation: $m->situation,
            topographie: $m->topographie,
        );
    }
}
