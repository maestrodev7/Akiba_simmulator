<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'kratospay' => [
        'base_url' => env('KRATOSPAY_BASE_URL', 'https://backendpay.kratospay.com'),
        'card_payment_page_base_url' => env('KRATOSPAY_CARD_PAYMENT_PAGE_BASE_URL', 'https://master.kratos-travel.com/'),
        'card_redirect_url' => env('KRATOSPAY_CARD_REDIRECT_URL', 'https://akimmo.center/'),
        'card_merchant_url' => env('KRATOSPAY_CARD_MERCHANT_URL', 'https://akimmo.center/'),
        'card_currency' => env('KRATOSPAY_CARD_CURRENCY', 'XAF'),
        'refresh_token' => env('KRATOSPAY_REFRESH_TOKEN'),
        'payment_token' => env('KRATOSPAY_PAYMENT_TOKEN'),
        'deposit_path' => env('KRATOSPAY_DEPOSIT_PATH', '/api/wallet/public/deposit'),
        'card_deposit_path' => env('KRATOSPAY_CARD_DEPOSIT_PATH', '/api/wallet/deposit/card'),
        'connect_timeout' => (int) env('KRATOSPAY_CONNECT_TIMEOUT', 10),
        'timeout' => (int) env('KRATOSPAY_TIMEOUT', 20),
    ],

];
