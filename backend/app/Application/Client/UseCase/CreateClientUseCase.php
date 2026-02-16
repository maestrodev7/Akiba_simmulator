<?php

declare(strict_types=1);

namespace App\Application\Client\UseCase;

use App\Application\Client\Dto\ClientDto;
use App\Application\Client\Dto\ClientResourceDto;
use App\Domain\Client\Entity\Client;
use App\Domain\Client\Repository\ClientRepositoryInterface;

/**
 * Cas d'usage : créer un client. Saisie partielle autorisée.
 * Dépend uniquement de l'interface du domaine (ClientRepositoryInterface).
 */
final class CreateClientUseCase
{
    public function __construct(
        private readonly ClientRepositoryInterface $clientRepository
    ) {
    }

    public function execute(ClientDto $dto): ClientResourceDto
    {
        $id = $this->clientRepository->nextIdentity();
        $client = new Client(
            id: $id,
            nom: $dto->nom,
            prenom: $dto->prenom,
            email: $dto->email,
            telephone: $dto->telephone,
            adresse: $dto->adresse,
            numeroRegistre: $dto->numeroRegistre,
        );
        $this->clientRepository->save($client);
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
