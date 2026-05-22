<?php

declare(strict_types=1);

namespace App\Presentation\Http\Controller\Api;

use App\Application\Simulation\UseCase\CalculerSimulationUseCase;
use App\Application\Terrain\Support\SuperficieConverter;
use App\Http\Controllers\Controller;
use App\Infrastructure\Persistence\Eloquent\ClientModel;
use App\Infrastructure\Persistence\Eloquent\ProduitModel;
use App\Infrastructure\Persistence\Eloquent\ProgrammeModel;
use App\Infrastructure\Persistence\Eloquent\TerrainModel;
use App\Presentation\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

final class SimulatorDraftController extends Controller
{
    public function __construct(
        private readonly CalculerSimulationUseCase $calculerSimulationUseCase,
    ) {
    }

    public function saveStep(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'step' => 'required|integer|min:1|max:4',
            'client_id' => 'nullable|string',
            'terrain_id' => 'nullable|string',
            'produit_id' => 'nullable|string',
            'data' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Données invalides.', 422, $validator->errors()->toArray());
        }

        $step = (int) $request->input('step');
        $payload = (array) $request->input('data', []);

        $result = DB::transaction(function () use ($step, $request, $payload): array {
            return match ($step) {
                1 => $this->saveStepClient($request, $payload),
                2 => $this->saveStepTerrainAndProduct($request, $payload),
                3 => $this->saveStepPlanning($request, $payload),
                4 => $this->saveStepProgramme($request, $payload),
            };
        });

        return ApiResponse::success($result, 'Brouillon sauvegarde.');
    }

    public function showDraft(string $produitId): JsonResponse
    {
        $produit = ProduitModel::query()->find($produitId);
        if ($produit === null) {
            return ApiResponse::error('Brouillon introuvable.', 404);
        }

        $terrain = TerrainModel::query()->find($produit->terrain_id);
        $client = $terrain !== null ? ClientModel::query()->find($terrain->client_id) : null;
        $programme = ProgrammeModel::query()
            ->where('produit_id', $produitId)
            ->get(['id', 'piece_id', 'nombre', 'surface_personnalisee'])
            ->toArray();

        $stepCompletion = [
            'step_1' => $client !== null && $this->isStep1Complete($client),
            'step_2' => $terrain !== null && $this->isStep2Complete($terrain, $produit),
            'step_3' => $this->isStep3Complete($produit),
            'step_4' => count($programme) > 0,
        ];

        return ApiResponse::success([
            'ids' => [
                'client_id' => $client?->id,
                'terrain_id' => $terrain?->id,
                'produit_id' => $produit->id,
            ],
            'client' => $client,
            'terrain' => $terrain,
            'produit' => $produit,
            'programme' => $programme,
            'step_completion' => $stepCompletion,
        ]);
    }

    public function recap(string $produitId): JsonResponse
    {
        $result = $this->calculerSimulationUseCase->execute($produitId);
        $budget = (float) ($result->budgetPrevisionnel ?? 0);
        $insuffisant = $budget < $result->coutTotal;
        $ecart = round($result->coutTotal - $budget, 2);

        return ApiResponse::success([
            'produit_id' => $produitId,
            'superficie_totale_m2' => $result->surfacePlancherTotale,
            'cout_total_estime' => $result->coutTotal,
            'budget_previsionnel' => $budget,
            'budget_suffisant' => !$insuffisant,
            'budget_insuffisant' => $insuffisant,
            'ecart_budget' => $insuffisant ? $ecart : 0,
            'message_budget' => $insuffisant
                ? 'Le budget est insuffisant pour la configuration actuelle.'
                : 'Le budget couvre la configuration actuelle.',
            'lignes' => $result->lignes,
        ]);
    }

    private function saveStepClient(Request $request, array $payload): array
    {
        $client = null;
        $clientId = $request->input('client_id');
        if (is_string($clientId) && $clientId !== '') {
            $client = ClientModel::query()->find($clientId);
        }
        if ($client === null) {
            $client = new ClientModel();
        }

        $client->fill([
            'nom' => $payload['nom'] ?? $client->nom,
            'prenom' => $payload['prenom'] ?? $client->prenom,
            'email' => $payload['email'] ?? $client->email,
            'telephone' => $payload['telephone'] ?? $client->telephone,
            'adresse' => $payload['adresse'] ?? $client->adresse,
            'numero_registre' => $payload['numero_registre'] ?? $client->numero_registre,
        ]);
        $client->save();

        return ['client_id' => $client->id];
    }

    private function saveStepTerrainAndProduct(Request $request, array $payload): array
    {
        $this->validateStep2Payload($payload);

        $clientId = (string) $request->input('client_id', '');
        if ($clientId === '') {
            abort(422, 'client_id requis pour l\'etape 2.');
        }

        $terrain = null;
        $terrainId = $request->input('terrain_id');
        if (is_string($terrainId) && $terrainId !== '') {
            $terrain = TerrainModel::query()->find($terrainId);
        }
        if ($terrain === null) {
            $terrain = new TerrainModel();
            $terrain->client_id = $clientId;
        }

        $superficieUnite = SuperficieConverter::normalizeUnit(
            $this->asSingleString($payload['superficie_unite'] ?? null) ?? (string) ($terrain->superficie_unite ?? 'm2')
        );
        $superficieSaisie = $this->asSingleFloat($payload['superficie'] ?? null);
        $superficieM2 = $superficieSaisie !== null
            ? SuperficieConverter::toSquareMeters($superficieSaisie, $superficieUnite)
            : $terrain->superficie;

        $terrain->fill([
            'adresse' => $this->asSingleString($payload['adresse'] ?? null) ?? $terrain->adresse,
            'superficie' => $superficieM2,
            'superficie_unite' => $superficieUnite,
            'titre_foncier' => $this->asSingleString($payload['titre_foncier'] ?? $payload['statut_juridique'] ?? null) ?? $terrain->titre_foncier,
            'site' => $this->asSingleString($payload['site'] ?? $payload['etat_du_site'] ?? null) ?? $terrain->site,
            'situation' => $this->asSingleString($payload['situation'] ?? null) ?? $terrain->situation,
            'topographie' => $this->asSingleString($payload['topographie'] ?? null) ?? $terrain->topographie,
        ]);
        $terrain->save();

        $produit = null;
        $produitId = $request->input('produit_id');
        if (is_string($produitId) && $produitId !== '') {
            $produit = ProduitModel::query()->find($produitId);
        }
        if ($produit === null) {
            $produit = new ProduitModel();
            $produit->terrain_id = $terrain->id;
        }

        $existingCaracteristiques = is_array($produit->caracteristiques) ? $produit->caracteristiques : [];
        $incomingCaracteristiques = is_array($payload['caracteristiques'] ?? null) ? $payload['caracteristiques'] : [];

        $allowed = $this->allowedStep2SingleChoices();

        $step2Caracteristiques = [
            'statut_juridique' => $this->asMultiValue($payload['statut_juridique'] ?? null),
            'etat_du_site' => $this->asMultiValue($payload['etat_du_site'] ?? null),
            'topographie' => $this->asMultiValue($payload['topographie'] ?? null),
            'situation' => $this->asMultiValue($payload['situation'] ?? null),
            'voie_existante' => $this->asMultiValue($payload['voie_existante'] ?? null),
            'documents_fournis' => $this->asMultiValue($payload['documents_fournis'] ?? null),
            'nature_travaux' => $this->asSingleMultiValue(
                $payload['nature_travaux'] ?? null,
                'nature des travaux',
                $allowed['nature_travaux']
            ),
            'type_construction' => $this->asSingleMultiValue(
                $payload['type_construction'] ?? null,
                'type de construction',
                $allowed['type_construction']
            ),
            'type_architecture' => $this->asSingleMultiValue(
                $payload['type_architecture'] ?? null,
                'type d\'architecture',
                $allowed['type_architecture']
            ),
            'materiaux' => $this->asSingleMultiValue(
                $payload['materiaux'] ?? null,
                'materiaux',
                $allowed['materiaux']
            ),
            'style_construction' => $this->asSingleMultiValue(
                $payload['style_construction'] ?? null,
                'style de construction',
                $allowed['style_construction']
            ),
            'espace_annexe' => $this->asMultiValueAllowed(
                $payload['espace_annexe'] ?? null,
                ['Véranda', 'Balcon', 'Garage']
            ),
            'nombre_etages' => $payload['nombre_etages'] ?? null,
            'nombre_sous_sol' => $payload['nombre_sous_sol'] ?? null,
            'type_toiture' => $this->asSingleMultiValue(
                $payload['type_toiture'] ?? null,
                'type de toiture',
                $allowed['type_toiture']
            ),
            'habillage_facade' => $this->asSingleMultiValue(
                $payload['habillage_facade'] ?? null,
                'habillage des facades',
                $allowed['habillage_facade']
            ),
            'menuiserie' => $this->asSingleMultiValue(
                $payload['menuiserie'] ?? null,
                'menuiserie',
                $allowed['menuiserie']
            ),
            'securisation_ouvertures' => $this->asSingleMultiValue(
                $payload['securisation_ouvertures'] ?? null,
                'securisation des ouvertures',
                $allowed['securisation_ouvertures']
            ),
        ];

        $mergedCaracteristiques = array_merge(
            $existingCaracteristiques,
            $incomingCaracteristiques,
            array_filter($step2Caracteristiques, static fn ($value) => $value !== null && $value !== [])
        );

        $typeProduit = $this->asSingleMultiValue(
            $payload['type_produit'] ?? null,
            'type de produit',
            $allowed['type_produit']
        );
        $materiauxProduit = $this->asSingleMultiValue(
            $payload['materiaux'] ?? null,
            'materiaux',
            $allowed['materiaux']
        );

        $produit->fill([
            'type_produit' => ($typeProduit !== null ? $typeProduit[0] : null) ?? $produit->type_produit,
            'materiaux' => ($materiauxProduit !== null ? $materiauxProduit[0] : null) ?? $produit->materiaux,
            'standing' => $this->asSingleString($payload['standing'] ?? null) ?? $produit->standing,
            'budget_previsionnel' => $this->asSingleFloat($payload['budget_previsionnel'] ?? null) ?? $produit->budget_previsionnel,
            'caracteristiques' => $mergedCaracteristiques,
        ]);
        $produit->save();

        return [
            'client_id' => $clientId,
            'terrain_id' => $terrain->id,
            'produit_id' => $produit->id,
        ];
    }

    private function saveStepPlanning(Request $request, array $payload): array
    {
        $produitId = (string) $request->input('produit_id', '');
        if ($produitId === '') {
            abort(422, 'produit_id requis pour l\'etape 3.');
        }

        $produit = ProduitModel::query()->find($produitId);
        if ($produit === null) {
            abort(404, 'Produit introuvable.');
        }

        $produit->fill([
            'date_debut_travaux' => $payload['date_debut_travaux'] ?? $produit->date_debut_travaux,
            'date_fin_travaux' => $payload['date_fin_travaux'] ?? $produit->date_fin_travaux,
            'budget_previsionnel' => $payload['budget_previsionnel'] ?? $produit->budget_previsionnel,
        ]);
        $produit->save();

        return [
            'client_id' => TerrainModel::query()->find($produit->terrain_id)?->client_id,
            'terrain_id' => $produit->terrain_id,
            'produit_id' => $produit->id,
        ];
    }

    private function saveStepProgramme(Request $request, array $payload): array
    {
        $produitId = (string) $request->input('produit_id', '');
        if ($produitId === '') {
            abort(422, 'produit_id requis pour l\'etape 4.');
        }

        $produit = ProduitModel::query()->find($produitId);
        if ($produit === null) {
            abort(404, 'Produit introuvable.');
        }

        $lignes = $payload['lignes'] ?? [];
        if (!is_array($lignes)) {
            abort(422, 'Le champ lignes doit etre un tableau.');
        }

        ProgrammeModel::query()->where('produit_id', $produitId)->delete();

        foreach ($lignes as $ligne) {
            if (!is_array($ligne) || empty($ligne['piece_id'])) {
                continue;
            }
            ProgrammeModel::query()->create([
                'produit_id' => $produitId,
                'piece_id' => (string) $ligne['piece_id'],
                'nombre' => max(0, (int) ($ligne['nombre'] ?? 0)),
                'surface_personnalisee' => isset($ligne['surface_personnalisee'])
                    ? (float) $ligne['surface_personnalisee']
                    : null,
            ]);
        }

        return [
            'client_id' => TerrainModel::query()->find($produit->terrain_id)?->client_id,
            'terrain_id' => $produit->terrain_id,
            'produit_id' => $produit->id,
        ];
    }

    private function isStep1Complete(ClientModel $client): bool
    {
        return !empty($client->nom)
            && !empty($client->prenom)
            && !empty($client->email)
            && !empty($client->telephone);
    }

    private function isStep2Complete(TerrainModel $terrain, ProduitModel $produit): bool
    {
        return !empty($terrain->adresse)
            && !empty($terrain->superficie)
            && !empty($produit->type_produit)
            && !empty($produit->budget_previsionnel);
    }

    private function isStep3Complete(ProduitModel $produit): bool
    {
        return !empty($produit->date_debut_travaux) && !empty($produit->date_fin_travaux);
    }

    private function validateStep2Payload(array $payload): void
    {
        $validator = Validator::make($payload, [
            'budget_previsionnel' => 'nullable|numeric|min:0',
            'adresse' => 'nullable|string|max:500',
            'superficie' => 'nullable|numeric|min:0',
            'superficie_unite' => 'nullable|in:m2,ha',
            'style_construction' => 'nullable',
            'type_architecture' => 'nullable',
            'type_produit' => 'nullable',
            'type_construction' => 'nullable',
            'materiaux' => 'nullable',
            'espace_annexe' => 'nullable',
            'type_toiture' => 'nullable',
            'habillage_facade' => 'nullable',
            'menuiserie' => 'nullable',
            'securisation_ouvertures' => 'nullable',
            'nature_travaux' => 'nullable',
        ]);

        if ($validator->fails()) {
            abort(422, $validator->errors()->first());
        }

        $allowed = $this->allowedStep2SingleChoices();
        foreach ($allowed as $field => $choices) {
            if (!array_key_exists($field, $payload)) {
                continue;
            }
            $this->asSingleMultiValue($payload[$field], $this->step2SingleChoiceLabel($field), $choices);
        }

        if (array_key_exists('espace_annexe', $payload)) {
            $this->asMultiValueAllowed(
                $payload['espace_annexe'],
                ['Véranda', 'Balcon', 'Garage']
            );
        }
    }

    /**
     * @return array<string, list<string>>
     */
    private function allowedStep2SingleChoices(): array
    {
        return [
            'type_produit' => ['Construction neuve', 'Travaux sur maison existante', 'Autres'],
            'nature_travaux' => [
                'Maison individuelle', 'Maison jumelée', 'Immeuble', 'Villa',
                'Dépendance', 'Piscine', 'Autre équipement',
            ],
            'type_construction' => [
                'Classique', 'Contemporaine', 'Duplex', 'Moderne',
                'Traditionnelle', 'Futuriste',
            ],
            'type_architecture' => ['traditionnelle', 'moderne', 'contemporaine', 'futuriste'],
            'materiaux' => [
                'Bois', 'Béton', 'Parpaings', 'Brique de terre cuite',
                'Brique de terre crue', 'Pisier',
            ],
            'style_construction' => [
                'Villa classique', 'Villa traditionnelle', 'Villa moderne', 'Villa contemporaine',
            ],
            'type_toiture' => [
                'Tuiles en terre cuite', 'Tuiles en bois', 'Tôles ondulée',
                'Tôles bac', 'Toiture terrasse en béton',
            ],
            'habillage_facade' => [
                'Carrelage', 'Béton brute', 'Enduit de ciment et chaux', 'Bardage métallique',
            ],
            'menuiserie' => ['Bois', 'PVC', 'Métalique', 'Aluminium'],
            'securisation_ouvertures' => ['Grilles métalliques', 'Claustras', 'Autres'],
        ];
    }

    private function step2SingleChoiceLabel(string $field): string
    {
        return match ($field) {
            'type_produit' => 'type de produit',
            'nature_travaux' => 'nature des travaux',
            'type_construction' => 'type de construction',
            'type_architecture' => 'type d\'architecture',
            'materiaux' => 'materiaux',
            'style_construction' => 'style de construction',
            'type_toiture' => 'type de toiture',
            'habillage_facade' => 'habillage des facades',
            'menuiserie' => 'menuiserie',
            'securisation_ouvertures' => 'securisation des ouvertures',
            default => $field,
        };
    }

    /**
     * @param list<string>|null $allowed
     */
    private function asSingleMultiValue(mixed $value, string $fieldLabel, ?array $allowed = null): ?array
    {
        if ($value === null) {
            return null;
        }

        $items = [];
        if (is_array($value)) {
            foreach ($value as $item) {
                if (is_scalar($item)) {
                    $normalized = trim((string) $item);
                    if ($normalized !== '') {
                        $items[] = $normalized;
                    }
                }
            }
        } elseif (is_scalar($value)) {
            $normalized = trim((string) $value);
            if ($normalized !== '') {
                $items[] = $normalized;
            }
        }

        $items = array_values(array_unique($items));

        if (count($items) > 1) {
            abort(422, "Un seul {$fieldLabel} est autorise.");
        }

        if (count($items) === 1 && $allowed !== null && !in_array($items[0], $allowed, true)) {
            abort(422, "{$fieldLabel} invalide.");
        }

        return $items === [] ? null : $items;
    }

    private function asMultiValue(mixed $value): ?array
    {
        if ($value === null) {
            return null;
        }

        if (is_array($value)) {
            $normalized = array_values(array_filter(array_map(
                static fn ($item) => is_scalar($item) ? trim((string) $item) : '',
                $value
            ), static fn (string $item) => $item !== ''));
            return $normalized === [] ? null : array_values(array_unique($normalized));
        }

        if (is_scalar($value)) {
            $single = trim((string) $value);
            return $single === '' ? null : [$single];
        }

        return null;
    }

    /**
     * @param list<string> $allowed
     */
    private function asMultiValueAllowed(mixed $value, array $allowed): ?array
    {
        $multi = $this->asMultiValue($value);
        if ($multi === null) {
            return null;
        }

        foreach ($multi as $item) {
            if (!in_array($item, $allowed, true)) {
                abort(422, 'Espace annexe invalide.');
            }
        }

        return $multi;
    }

    private function asSingleString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        if (is_array($value)) {
            foreach ($value as $item) {
                if (is_scalar($item)) {
                    $normalized = trim((string) $item);
                    if ($normalized !== '') {
                        return $normalized;
                    }
                }
            }
            return null;
        }

        if (is_scalar($value)) {
            $normalized = trim((string) $value);
            return $normalized === '' ? null : $normalized;
        }

        return null;
    }

    private function asSingleFloat(mixed $value): ?float
    {
        if ($value === null) {
            return null;
        }

        if (is_array($value)) {
            foreach ($value as $item) {
                if (is_numeric($item)) {
                    return (float) $item;
                }
            }
            return null;
        }

        return is_numeric($value) ? (float) $value : null;
    }
}

