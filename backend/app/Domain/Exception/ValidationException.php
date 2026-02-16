<?php

declare(strict_types=1);

namespace App\Domain\Exception;

use Throwable;

/**
 * Erreur de validation métier ou de saisie.
 * Les erreurs sont exposées dans un format structuré (champ => messages).
 */
final class ValidationException extends DomainException
{
    /** @var array<string, list<string>> */
    private array $errors;

    /**
     * @param array<string, list<string>> $errors
     */
    public function __construct(
        string $message = 'Données invalides.',
        array $errors = [],
        int $code = 0,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
        $this->errors = $errors;
    }

    /**
     * @return array<string, list<string>>
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getHttpStatusCode(): int
    {
        return 422;
    }
}
