<?php

declare(strict_types=1);

namespace App\Application\Client\UseCase;

use App\Application\Client\Dto\ClientDto;
use App\Application\Client\Dto\ClientResourceDto;
use App\Domain\Client\Entity\Client;
use App\Domain\Client\Repository\ClientRepositoryInterface;
use App\Domain\Exception\NotFoundException;

/**
 * Cas d'usage : mettre à jour un client (PUT). Saisie partielle : seuls les champs fournis sont mis à jour.
 * Dépend uniquement de l'interface du domaine.
 */
final class UpdateClientUseCase
{
    public function __construct(
        private readonly ClientRepositoryInterface $clientRepository
    ) {
    }

    /**
     * @throws NotFoundException
     */
    public function execute(string $id, ClientDto $dto): ClientResourceDto
    {
        $client = $this->clientRepository->getById($id);
        if ($client === null) {
            throw new NotFoundException('Client non trouvé.');
        }

        $client = $this->applyDto($client, $dto);
        $this->clientRepository->save($client);
        return $this->toResource($client);
    }

    private function applyDto(Client $client, ClientDto $dto): Client
    {
        if ($dto->nom !== null) {
            $client = $client->withNom($dto->nom);
        }
        if ($dto->prenom !== null) {
            $client = $client->withPrenom($dto->prenom);
        }
        if ($dto->email !== null) {
            $client = $client->withEmail($dto->email);
        }
        if ($dto->telephone !== null) {
            $client = $client->withTelephone($dto->telephone);
        }
        if ($dto->adresse !== null) {
            $client = $client->withAdresse($dto->adresse);
        }
        if ($dto->numeroRegistre !== null) {
            $client = $client->withNumeroRegistre($dto->numeroRegistre);
        }
        return $client;
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
