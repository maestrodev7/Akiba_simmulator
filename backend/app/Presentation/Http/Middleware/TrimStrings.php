<?php

declare(strict_types=1);

namespace App\Presentation\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Trim toutes les entrées de la requête (couche Presentation).
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
