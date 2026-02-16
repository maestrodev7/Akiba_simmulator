<?php

declare(strict_types=1);

namespace App\Application\Client\UseCase;

use App\Application\Client\Dto\ClientResourceDto;
use App\Domain\Client\Entity\Client;
use App\Domain\Client\Repository\ClientRepositoryInterface;
use App\Domain\Exception\NotFoundException;

/**
 * Cas d'usage : récupérer un client par ID.
 */
final class GetClientUseCase
{
    public function __construct(
        private readonly ClientRepositoryInterface $clientRepository
    ) {
    }

    /**
     * @throws NotFoundException
     */
    public function execute(string $id): ClientResourceDto
    {
        $client = $this->clientRepository->getById($id);
        if ($client === null) {
            throw new NotFoundException('Client non trouvé.');
        }
        return $this->toResource($client);
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
