<?php

declare(strict_types=1);

namespace App\Application\Client\Dto;

/**
 * DTO d'entrée pour création / mise à jour partielle d'un client.
 * Tous les champs sont optionnels (saisie partielle).
 */
final class ClientDto
{
    public function __construct(
        public readonly ?string $nom = null,
        public readonly ?string $prenom = null,
        public readonly ?string $email = null,
        public readonly ?string $telephone = null,
        public readonly ?string $adresse = null,
        public readonly ?string $numeroRegistre = null,
    ) {
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            nom: isset($data['nom']) ? (string) $data['nom'] : null,
            prenom: isset($data['prenom']) ? (string) $data['prenom'] : null,
            email: isset($data['email']) ? (string) $data['email'] : null,
            telephone: isset($data['telephone']) ? (string) $data['telephone'] : null,
            adresse: isset($data['adresse']) ? (string) $data['adresse'] : null,
            numeroRegistre: isset($data['numero_registre']) ? (string) $data['numero_registre'] : null,
        );
    }
}
