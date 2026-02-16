<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Repository;

use App\Domain\Produit\Entity\Produit;
use App\Domain\Produit\Repository\ProduitRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\ProduitModel;

final class ProduitRepository implements ProduitRepositoryInterface
{
    public function nextIdentity(): string
    {
        do {
            $id = ProduitModel::generateShortId();
        } while (ProduitModel::where('id', $id)->exists());
        return $id;
    }

    public function save(Produit $produit): void
    {
        $model = ProduitModel::firstOrNew(['id' => $produit->getId()]);
        $model->terrain_id = $produit->getTerrainId();
        $model->type_produit = $produit->getTypeProduit();
        $model->materiaux = $produit->getMateriaux();
        $model->standing = $produit->getStanding();
        $model->budget_previsionnel = $produit->getBudgetPrevisionnel();
        $model->date_debut_travaux = $produit->getDateDebutTravaux();
        $model->date_fin_travaux = $produit->getDateFinTravaux();
        $model->caracteristiques = $produit->getCaracteristiques();
        $model->save();
    }

    public function getById(string $id): ?Produit
    {
        $model = ProduitModel::find($id);
        return $model ? $this->toEntity($model) : null;
    }

    /** @return list<Produit> */
    public function getByTerrainId(string $terrainId): array
    {
        return ProduitModel::where('terrain_id', $terrainId)->orderBy('created_at')->get()
            ->map(fn (ProduitModel $m) => $this->toEntity($m))->all();
    }

    /** @return array{items: list<Produit>, total: int} */
    public function getPaginated(int $page, int $perPage): array
    {
        $query = ProduitModel::query()->orderBy('created_at', 'desc');
        $total = $query->count();
        $items = $query->offset(($page - 1) * $perPage)->limit($perPage)->get()
            ->map(fn (ProduitModel $m) => $this->toEntity($m))->all();
        return ['items' => $items, 'total' => $total];
    }

    public function delete(string $id): bool
    {
        return ProduitModel::where('id', $id)->delete() > 0;
    }

    private function toEntity(ProduitModel $m): Produit
    {
        return new Produit(
            id: $m->id,
            terrainId: $m->terrain_id,
            typeProduit: $m->type_produit,
            materiaux: $m->materiaux,
            standing: $m->standing,
            budgetPrevisionnel: $m->budget_previsionnel,
            dateDebutTravaux: $m->date_debut_travaux,
            dateFinTravaux: $m->date_fin_travaux,
            caracteristiques: $m->caracteristiques,
        );
    }
}
