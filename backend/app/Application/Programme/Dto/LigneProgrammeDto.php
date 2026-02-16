<?php

declare(strict_types=1);

namespace App\Application\Programme\Dto;

final class LigneProgrammeDto
{
    public function __construct(
        public readonly string $pieceId,
        public readonly int $nombre,
        public readonly ?float $surfacePersonnalisee = null,
    ) {
    }

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data): self
    {
        return new self(
            pieceId: (string) ($data['piece_id'] ?? ''),
            nombre: (int) ($data['nombre'] ?? 0),
            surfacePersonnalisee: isset($data['surface_personnalisee']) ? (float) $data['surface_personnalisee'] : null,
        );
    }
}
