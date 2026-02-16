<?php

declare(strict_types=1);

namespace App\Domain\Exception;

use Exception;

/**
 * Exception de base du domaine. Toutes les exceptions métier en héritent.
 * La couche Infrastructure les transforme en réponses HTTP via le handler.
 */
abstract class DomainException extends Exception
{
    public function __construct(
        string $message = '',
        int $code = 0,
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }

    /** Code HTTP à renvoyer pour cette exception */
    abstract public function getHttpStatusCode(): int;
}
