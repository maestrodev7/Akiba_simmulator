<?php

declare(strict_types=1);

namespace App\Domain\Client\Repository;

use App\Domain\Client\Entity\Client;

/**
 * Port (interface) du domaine pour la persistance des clients.
 * L'Application et l'Infrastructure dépendent de cette interface, pas de l'implémentation.
 */
interface ClientRepositoryInterface
{
    public function nextIdentity(): string;

    public function save(Client $client): void;

    public function getById(string $id): ?Client;

    /**
     * @return array{items: list<Client>, total: int}
     */
    public function getPaginated(int $page, int $perPage): array;

    public function delete(string $id): bool;
}
