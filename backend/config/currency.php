<?php

declare(strict_types=1);

/**
 * Taux : 1 unité de devise = X XAF (base de stockage et API paiement).
 */
return [
    'base' => 'XAF',
    'rates' => [
        'XAF' => 1.0,
        'EUR' => (float) env('CURRENCY_RATE_EUR_XAF', 655.957),
        'USD' => (float) env('CURRENCY_RATE_USD_XAF', 600.0),
    ],
    'labels' => [
        'XAF' => 'FCFA (XAF)',
        'EUR' => 'Euro (€)',
        'USD' => 'Dollar ($)',
    ],
];
