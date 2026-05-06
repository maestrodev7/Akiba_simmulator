<?php

declare(strict_types=1);

namespace App\Application\Payment\Support;

use App\Models\PaymentSetting;

final class PaymentAmountSetting
{
    public const KEY = 'default_payment_amount';

    private function __construct()
    {
    }

    public static function get(): ?float
    {
        $rawValue = PaymentSetting::query()
            ->where('key', self::KEY)
            ->value('value');

        if (!is_string($rawValue) && !is_numeric($rawValue)) {
            return null;
        }

        $amount = (float) $rawValue;
        if ($amount <= 0) {
            return null;
        }

        return $amount;
    }

    public static function set(float $amount): void
    {
        PaymentSetting::query()->updateOrCreate(
            ['key' => self::KEY],
            ['value' => (string) $amount],
        );
    }
}

