<?php

declare(strict_types=1);

namespace App\Application\Client\Dto;

/**
 * DTO de sortie pour exposer un client à l'API (lecture seule).
 */
final class ClientResourceDto
{
    public function __construct(
        public readonly string $id,
        public readonly ?string $nom = null,
        public readonly ?string $prenom = null,
        public readonly ?string $email = null,
        public readonly ?string $telephone = null,
        public readonly ?string $adresse = null,
        public readonly ?string $numeroRegistre = null,
    ) {
    }
}
