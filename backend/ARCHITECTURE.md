# Architecture hexagonale (Clean Architecture) – Backend Akiba

## Couches

- **Domain** : Entités, interfaces (ports) des repositories, exceptions métier. Aucune dépendance vers l’extérieur.
- **Application** : Cas d’usage (Use Cases), DTOs. Dépend uniquement du Domain via les **interfaces** (pas des implémentations).
- **Infrastructure** : Implémentations des ports (repositories Eloquent), contrôleurs HTTP, middleware, structure de réponse API. Dépend du Domain et de l’Application.

## Communication entre couches

- L’Application et l’Infrastructure **ne parlent qu’aux interfaces du Domain** (ex. `ClientRepositoryInterface`), jamais aux implémentations concrètes.
- Le binding interface → implémentation se fait dans `AppServiceProvider` (Inversion de dépendances).

## Réponses API

- Toutes les réponses passent par `App\Infrastructure\Http\ApiResponse` :
  - Succès : `{ "success": true, "data": ..., "message"?: "..." }`
  - Erreur : `{ "success": false, "message": "...", "errors"?: {...} }`
  - Liste paginée : `{ "success": true, "data": [...], "meta": { "current_page", "per_page", "total", "last_page", "from", "to" } }`

## Exceptions

- Exceptions métier dans `App\Domain\Exception\*` : `NotFoundException` (404), `ValidationException` (422), `UnauthorizedException` (401), `ForbiddenException` (403), `ConflictException` (409).
- Chaque exception expose `getHttpStatusCode()`. Le handler global (`bootstrap/app.php`) les convertit en JSON avec la structure d’erreur commune.

## Mise à jour des ressources

- **PUT** est utilisé pour la mise à jour (y compris partielle) : seuls les champs envoyés dans le body sont mis à jour.

## Données et IDs

- **Trim** : le middleware `TrimStrings` (groupe `api`) trim toutes les entrées pour éviter les problèmes d’espaces.
- **IDs** : chaînes courtes (12 caractères alphanumériques), uniques, générées dans l’Infrastructure (`HasShortId`). Clé primaire string en base (MySQL).

## Pagination

- Listes : paramètres `page` et `per_page` (défaut 15, max 100). Réponse avec `data` + `meta` (current_page, per_page, total, last_page, from, to).

## SOLID

- **S** : Use Cases et repositories ont une seule responsabilité.
- **O** : Nouvelles règles métier via nouveaux Use Cases / nouvelles implémentations de ports.
- **L** : Substitution des implémentations via les interfaces.
- **I** : Interfaces du Domain limitées à un rôle (ex. `ClientRepositoryInterface`).
- **D** : Application et Infrastructure dépendent des abstractions (interfaces Domain), pas des implémentations.
