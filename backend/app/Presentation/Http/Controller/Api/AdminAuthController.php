<?php

declare(strict_types=1);

namespace App\Presentation\Http\Controller\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Presentation\Http\ApiResponse;
use Firebase\JWT\JWT;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

final class AdminAuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Données invalides.', 422, $validator->errors()->toArray());
        }

        $data = $validator->validated();
        $user = User::query()->create([
            'name' => (string) $data['name'],
            'email' => (string) $data['email'],
            'password' => Hash::make((string) $data['password']),
        ]);

        return ApiResponse::created([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ], 'Compte admin créé.');
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Données invalides.', 422, $validator->errors()->toArray());
        }

        $data = $validator->validated();
        $user = User::query()->where('email', $data['email'])->first();

        if ($user === null || !Hash::check((string) $data['password'], (string) $user->password)) {
            return ApiResponse::error('Email ou mot de passe invalide.', 401);
        }

        $token = $this->generateJwtForUser($user);

        return ApiResponse::success([
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => 3600,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ], 'Connexion réussie.');
    }

    public function me(Request $request): JsonResponse
    {
        /** @var array<string, mixed>|null $jwtUser */
        $jwtUser = $request->attributes->get('jwt_user');
        if ($jwtUser === null) {
            return ApiResponse::error('Non authentifié.', 401);
        }

        return ApiResponse::success([
            'id' => $jwtUser['sub'] ?? null,
            'name' => $jwtUser['name'] ?? null,
            'email' => $jwtUser['email'] ?? null,
            'issued_at' => $jwtUser['iat'] ?? null,
            'expires_at' => $jwtUser['exp'] ?? null,
        ]);
    }

    private function generateJwtForUser(User $user): string
    {
        $now = time();
        $payload = [
            'iss' => config('app.url', 'akiba-backend'),
            'sub' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'iat' => $now,
            'exp' => $now + 3600,
        ];

        return JWT::encode($payload, $this->jwtSecret(), 'HS256');
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

