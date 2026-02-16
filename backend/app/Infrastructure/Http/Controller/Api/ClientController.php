<?php

declare(strict_types=1);

namespace App\Infrastructure\Http\Controller\Api;

use App\Application\Client\Dto\ClientDto;
use App\Application\Client\UseCase\CreateClientUseCase;
use App\Application\Client\UseCase\GetClientUseCase;
use App\Application\Client\UseCase\ListClientsUseCase;
use App\Application\Client\UseCase\UpdateClientUseCase;
use App\Infrastructure\Http\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Contrôleur API Client. Délègue aux Use Cases (Application).
 * Utilise PUT pour la mise à jour (mise à jour partielle autorisée).
 */
final class ClientController extends Controller
{
    public function __construct(
        private readonly CreateClientUseCase $createClientUseCase,
        private readonly UpdateClientUseCase $updateClientUseCase,
        private readonly GetClientUseCase $getClientUseCase,
        private readonly ListClientsUseCase $listClientsUseCase,
    ) {
    }

    /**
     * GET /api/clients (liste paginée).
     */
    public function index(Request $request): JsonResponse
    {
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 15);

        $result = $this->listClientsUseCase->execute($page, $perPage);

        $items = array_map(
            fn ($dto) => [
                'id' => $dto->id,
                'nom' => $dto->nom,
                'prenom' => $dto->prenom,
                'email' => $dto->email,
                'telephone' => $dto->telephone,
                'adresse' => $dto->adresse,
                'numero_registre' => $dto->numeroRegistre,
            ],
            $result->getItems()
        );

        return ApiResponse::paginated(
            $items,
            $result->getTotal(),
            $result->getPage(),
            $result->getPerPage()
        );
    }

    /**
     * POST /api/clients (création, saisie partielle autorisée).
     */
    public function store(Request $request): JsonResponse
    {
        $dto = ClientDto::fromArray($request->all());
        $resource = $this->createClientUseCase->execute($dto);
        return ApiResponse::created($this->resourceToArray($resource), 'Client créé.');
    }

    /**
     * GET /api/clients/{id}.
     */
    public function show(string $id): JsonResponse
    {
        $resource = $this->getClientUseCase->execute($id);
        return ApiResponse::success($this->resourceToArray($resource));
    }

    /**
     * PUT /api/clients/{id} (mise à jour partielle : seuls les champs envoyés sont mis à jour).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $dto = ClientDto::fromArray($request->all());
        $resource = $this->updateClientUseCase->execute($id, $dto);
        return ApiResponse::success($this->resourceToArray($resource), 'Client mis à jour.');
    }

    /**
     * @param \App\Application\Client\Dto\ClientResourceDto $resource
     * @return array<string, mixed>
     */
    private function resourceToArray($resource): array
    {
        return [
            'id' => $resource->id,
            'nom' => $resource->nom,
            'prenom' => $resource->prenom,
            'email' => $resource->email,
            'telephone' => $resource->telephone,
            'adresse' => $resource->adresse,
            'numero_registre' => $resource->numeroRegistre,
        ];
    }
}
