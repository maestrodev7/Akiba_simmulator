# Architecture hexagonale – Backend Akiba

## Séparation des couches

- **Domain** : Entités, interfaces (ports) des repositories, exceptions métier. Aucune dépendance vers l’extérieur.
- **Application** : Cas d’usage (Use Cases), DTOs. Dépend uniquement du **Domain** via les interfaces.
- **Infrastructure** : **Persistence uniquement** – modèles Eloquent, implémentations des repositories. Aucune logique HTTP.
- **Presentation** : Contrôleurs HTTP, middleware, structure de réponse API (`ApiResponse`). Délègue à l’Application (Use Cases) et renvoie des réponses HTTP.

La couche **Presentation** est distincte de l’**Infrastructure** : les contrôleurs et la forme des réponses n’appartiennent pas à la persistance.

## Communication entre couches

- L’Application et l’Infrastructure dépendent **uniquement des interfaces du Domain** (ex. `ClientRepositoryInterface`). Le binding interface → implémentation est fait dans `AppServiceProvider`.
- La Presentation appelle les Use Cases (Application) et utilise `App\Presentation\Http\ApiResponse` pour formater toutes les réponses.

## Modules implémentés

| Module | Domain | Application | Infrastructure | Presentation |
|--------|--------|-------------|----------------|--------------|
| **Client** | Entity, RepositoryInterface | DTOs, Create/Update/Get/List | ClientModel, ClientRepository | ClientController |
| **Terrain** | Entity, RepositoryInterface | DTOs, Create/Update/Get/ListByClient | TerrainModel, TerrainRepository | TerrainController |
| **Produit** | Entity, RepositoryInterface | DTOs, Create/Update/Get/ListByTerrain | ProduitModel, ProduitRepository | ProduitController |
| **Piece** (catalogue) | Entity, RepositoryInterface | ListPieces | PieceModel, PieceRepository | PieceController |
| **Programme** | LigneProgramme, RepositoryInterface | Add/Update/ListLignesByProduit | ProgrammeModel, ProgrammeRepository | ProgrammeController |
| **Simulation** | — | CalculerSimulationUseCase | — | SimulationController |

## Simulation financière (PDF §6)

- **SP** (surface de plancher totale) = somme des (surface unitaire × nombre) pour chaque ligne du programme. Surface unitaire = `surface_personnalisee` si renseignée, sinon `surface_standard` de la pièce.
- **Total** = SP × Prix/m² × Indice matériaux.
- Standing : standard = 305 €/m², moyen = 475 €/m², haut = 610 €/m².
- Indice matériaux : parpaings/béton = 1, brique = 0,75, bois = 0,65.

Endpoint : `GET /api/clients/{clientId}/terrains/{terrainId}/produits/{produitId}/simulation`.

## Réponses API

- Succès : `{ "success": true, "data": ..., "message"?: "..." }`.
- Erreur : `{ "success": false, "message": "...", "errors"?: {...} }`.
- Listes paginées (clients) : `data` + `meta` (current_page, per_page, total, last_page, from, to).

## Exceptions (Domain)

- `NotFoundException` (404), `ValidationException` (422), `UnauthorizedException` (401), `ForbiddenException` (403), `ConflictException` (409).
- Le handler dans `bootstrap/app.php` convertit ces exceptions en JSON via `Presentation\Http\ApiResponse::error`.

## Routes API (imbriquées)

- `GET|POST /api/clients`, `GET|PUT /api/clients/{client}`.
- `GET /api/pieces` (catalogue).
- `GET|POST /api/clients/{clientId}/terrains`, `GET|PUT /api/clients/{clientId}/terrains/{terrain}`.
- `GET|POST /api/clients/.../terrains/{terrainId}/produits`, `GET|PUT .../produits/{produit}`.
- `GET|POST .../produits/{produit}/programme`, `PUT .../programme/{ligneId}`.
- `GET .../produits/{produit}/simulation`.

## Données et techniques

- **Trim** : middleware `Presentation\Http\Middleware\TrimStrings` sur le groupe `api`.
- **IDs** : chaînes courtes (12 caractères alphanumériques), générées dans l’Infrastructure (`HasShortId`).
- **Mise à jour** : PUT avec saisie partielle (seuls les champs envoyés sont mis à jour).
