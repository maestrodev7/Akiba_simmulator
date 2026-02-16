<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use Illuminate\Support\Str;

/**
 * Génère un ID court, lisible et unique (12 caractères alphanumériques minuscules).
 * Évite les espaces et caractères ambigus (0/O, 1/l exclus si besoin ; ici on garde 0-9a-z).
 */
trait HasShortId
{
    public static function generateShortId(): string
    {
        return Str::lower(Str::random(12));
    }
}
