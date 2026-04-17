<?php

declare(strict_types=1);

namespace App\Presentation\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class VerifyJwtToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $authHeader = (string) $request->header('Authorization', '');
        if (!str_starts_with($authHeader, 'Bearer ')) {
            return \App\Presentation\Http\ApiResponse::error('Token manquant.', 401);
        }

        $token = trim(substr($authHeader, 7));
        if ($token === '') {
            return \App\Presentation\Http\ApiResponse::error('Token invalide.', 401);
        }

        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret(), 'HS256'));
            $request->attributes->set('jwt_user', (array) $decoded);
        } catch (\Throwable) {
            return \App\Presentation\Http\ApiResponse::error('Token invalide ou expiré.', 401);
        }

        return $next($request);
    }

    private function jwtSecret(): string
    {
        $secret = (string) env('JWT_SECRET', '');
        if ($secret !== '') {
            return $secret;
        }

        $appKey = (string) config('app.key', '');
        if (str_starts_with($appKey, 'base64:')) {
            $decoded = base64_decode(substr($appKey, 7), true);
            if ($decoded !== false && $decoded !== '') {
                return $decoded;
            }
        }

        if ($appKey !== '') {
            return $appKey;
        }

        return 'change-me-in-production';
    }
}

