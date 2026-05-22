<?php

declare(strict_types=1);

namespace App\Application\Payment\Support;

final class CurrencyConverter
{
    public const BASE = 'XAF';

    /**
     * @return array<string, float>
     */
    public static function rates(): array
    {
        /** @var array<string, float> $rates */
        $rates = config('currency.rates', ['XAF' => 1.0]);

        return $rates;
    }

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        /** @var array<string, string> $labels */
        $labels = config('currency.labels', []);

        return $labels;
    }

    public static function isSupported(string $code): bool
    {
        return array_key_exists(strtoupper($code), self::rates());
    }

    public static function toXaf(float $amount, string $fromCurrency): float
    {
        $code = strtoupper($fromCurrency);
        $rates = self::rates();
        if (!isset($rates[$code]) || $rates[$code] <= 0) {
            return $amount;
        }

        return round($amount * $rates[$code], 2);
    }

    public static function fromXaf(float $amountXaf, string $toCurrency): float
    {
        $code = strtoupper($toCurrency);
        $rates = self::rates();
        if (!isset($rates[$code]) || $rates[$code] <= 0) {
            return $amountXaf;
        }

        return round($amountXaf / $rates[$code], 2);
    }
}
