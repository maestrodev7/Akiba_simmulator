<?php

declare(strict_types=1);

namespace App\Application\Client\UseCase;

use App\Application\Client\Dto\ClientResourceDto;
use App\Application\Common\Dto\PaginatedResult;
use App\Domain\Client\Entity\Client;
use App\Domain\Client\Repository\ClientRepositoryInterface;

/**
 * Cas d'usage : lister les clients avec pagination.
 */
final class ListClientsUseCase
{
    public function __construct(
        private readonly ClientRepositoryInterface $clientRepository
    ) {
    }

    public function execute(int $page = 1, int $perPage = 15): PaginatedResult
    {
        $perPage = max(1, min(100, $perPage));
        $page = max(1, $page);

        $result = $this->clientRepository->getPaginated($page, $perPage);
        $items = array_map(
            fn (Client $client) => $this->toResource($client),
            $result['items']
        );

        return new PaginatedResult(
            items: $items,
            total: $result['total'],
            page: $page,
            perPage: $perPage
        );
    }

    private function toResource(Client $client): ClientResourceDto
    {
        return new ClientResourceDto(
            id: $client->getId(),
            nom: $client->getNom(),
            prenom: $client->getPrenom(),
            email: $client->getEmail(),
            telephone: $client->getTelephone(),
            adresse: $client->getAdresse(),
            numeroRegistre: $client->getNumeroRegistre(),
        );
    }
}
