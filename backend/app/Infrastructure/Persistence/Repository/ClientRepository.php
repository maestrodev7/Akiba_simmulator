<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Repository;

use App\Domain\Client\Entity\Client;
use App\Domain\Client\Repository\ClientRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\ClientModel;

/**
 * Implémentation du port ClientRepositoryInterface (adaptateur persistance).
 * Dépend du Domain (interface + entity), pas l'inverse.
 */
final class ClientRepository implements ClientRepositoryInterface
{
    public function nextIdentity(): string
    {
        do {
            $id = ClientModel::generateShortId();
        } while (ClientModel::where('id', $id)->exists());

        return $id;
    }

    public function save(Client $client): void
    {
        $model = ClientModel::firstOrNew(['id' => $client->getId()]);
        $model->nom = $client->getNom();
        $model->prenom = $client->getPrenom();
        $model->email = $client->getEmail();
        $model->telephone = $client->getTelephone();
        $model->adresse = $client->getAdresse();
        $model->numero_registre = $client->getNumeroRegistre();
        $model->save();
    }

    public function getById(string $id): ?Client
    {
        $model = ClientModel::find($id);
        if ($model === null) {
            return null;
        }
        return $this->toEntity($model);
    }

    /**
     * @return array{items: list<Client>, total: int}
     */
    public function getPaginated(int $page, int $perPage): array
    {
        $query = ClientModel::query()->orderBy('created_at', 'desc');
        $total = $query->count();
        $models = $query->offset(($page - 1) * $perPage)->limit($perPage)->get();

        $items = $models->map(fn (ClientModel $m) => $this->toEntity($m))->all();
        return ['items' => $items, 'total' => $total];
    }

    public function delete(string $id): bool
    {
        return ClientModel::query()->where('id', $id)->delete() > 0;
    }

    private function toEntity(ClientModel $model): Client
    {
        return new Client(
            id: $model->id,
            nom: $model->nom,
            prenom: $model->prenom,
            email: $model->email,
            telephone: $model->telephone,
            adresse: $model->adresse,
            numeroRegistre: $model->numero_registre,
        );
    }
}
