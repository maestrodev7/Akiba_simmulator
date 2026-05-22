<?php

declare(strict_types=1);

namespace App\Application\Terrain\Support;

final class SuperficieConverter
{
    private const HA_TO_M2 = 10_000.0;

    public static function normalizeUnit(?string $unit): string
    {
        return strtolower((string) $unit) === 'ha' ? 'ha' : 'm2';
    }

    public static function toSquareMeters(float $value, string $unit): float
    {
        if (self::normalizeUnit($unit) === 'ha') {
            return round($value * self::HA_TO_M2, 2);
        }

        return round($value, 2);
    }
}
