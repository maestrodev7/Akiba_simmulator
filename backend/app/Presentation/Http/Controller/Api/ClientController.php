<?php

declare(strict_types=1);

namespace App\Presentation\Http\Controller\Api;

use App\Application\Client\Dto\ClientDto;
use App\Application\Client\UseCase\CreateClientUseCase;
use App\Application\Client\UseCase\GetClientUseCase;
use App\Application\Client\UseCase\ListClientsUseCase;
use App\Application\Client\UseCase\UpdateClientUseCase;
use App\Http\Controllers\Controller;
use App\Presentation\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Contrôleur API Client. Couche Presentation : délègue aux Use Cases (Application).
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

    public function index(Request $request): JsonResponse
    {
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 15);
        $result = $this->listClientsUseCase->execute($page, $perPage);
        $items = array_map(fn ($dto) => $this->resourceToArray($dto), $result->getItems());
        return ApiResponse::paginated($items, $result->getTotal(), $result->getPage(), $result->getPerPage());
    }

    public function store(Request $request): JsonResponse
    {
        $dto = ClientDto::fromArray($request->all());
        $resource = $this->createClientUseCase->execute($dto);
        return ApiResponse::created($this->resourceToArray($resource), 'Client créé.');
    }

    public function show(string $id): JsonResponse
    {
        $resource = $this->getClientUseCase->execute($id);
        return ApiResponse::success($this->resourceToArray($resource));
    }

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
