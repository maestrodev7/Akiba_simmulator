<?php

declare(strict_types=1);

namespace App\Presentation\Http;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\Response;

/**
 * Structure de réponse API commune. Couche Presentation uniquement.
 */
final class ApiResponse
{
    private function __construct()
    {
    }

    public static function success(
        mixed $data = null,
        ?string $message = null,
        int $status = Response::HTTP_OK
    ): JsonResponse {
        $body = ['success' => true, 'data' => $data];
        if ($message !== null && $message !== '') {
            $body['message'] = $message;
        }
        return new JsonResponse($body, $status);
    }

    public static function created(mixed $data = null, ?string $message = null): JsonResponse
    {
        return self::success($data, $message ?? 'Ressource créée.', Response::HTTP_CREATED);
    }

    public static function error(
        string $message,
        int $status = Response::HTTP_BAD_REQUEST,
        ?array $errors = null
    ): JsonResponse {
        $body = ['success' => false, 'message' => $message];
        if ($errors !== null && $errors !== []) {
            $body['errors'] = $errors;
        }
        return new JsonResponse($body, $status);
    }

    /**
     * @param list<mixed> $items
     */
    public static function paginated(
        array $items,
        int $total,
        int $page,
        int $perPage,
        ?string $message = null
    ): JsonResponse {
        $lastPage = $perPage > 0 ? (int) ceil($total / $perPage) : 1;
        $body = [
            'success' => true,
            'data' => $items,
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => $lastPage,
                'from' => $total > 0 ? ($page - 1) * $perPage + 1 : null,
                'to' => $total > 0 ? min($page * $perPage, $total) : null,
            ],
        ];
        if ($message !== null && $message !== '') {
            $body['message'] = $message;
        }
        return new JsonResponse($body, Response::HTTP_OK);
    }

    public static function fromPaginator(LengthAwarePaginator $paginator): JsonResponse
    {
        return self::paginated(
            $paginator->items(),
            $paginator->total(),
            $paginator->currentPage(),
            $paginator->perPage()
        );
    }
}
