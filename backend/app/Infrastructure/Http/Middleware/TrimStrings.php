<?php

declare(strict_types=1);

namespace App\Infrastructure\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Trim toutes les entrées de la requête pour éviter les problèmes d'espaces.
 * S'applique aux chaînes uniquement (récursif sur tableaux).
 */
class TrimStrings
{
    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();
        $request->merge($this->trimRecursive($input));
        return $next($request);
    }

    /**
     * @param array<string, mixed>|string $data
     * @return array<string, mixed>|string
     */
    private function trimRecursive(array|string $data): array|string
    {
        if (is_string($data)) {
            return trim($data);
        }
        $result = [];
        foreach ($data as $key => $value) {
            $result[$key] = is_array($value)
                ? $this->trimRecursive($value)
                : (is_string($value) ? trim($value) : $value);
        }
        return $result;
    }
}
