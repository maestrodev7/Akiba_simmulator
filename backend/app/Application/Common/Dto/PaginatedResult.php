<?php

declare(strict_types=1);

namespace App\Application\Common\Dto;

/**
 * DTO de résultat paginé. Utilisé par la couche Application uniquement.
 */
final class PaginatedResult
{
    /**
     * @param list<object> $items
     */
    public function __construct(
        private readonly array $items,
        private readonly int $total,
        private readonly int $page,
        private readonly int $perPage,
    ) {
    }

    /**
     * @return list<object>
     */
    public function getItems(): array
    {
        return $this->items;
    }

    public function getTotal(): int
    {
        return $this->total;
    }

    public function getPage(): int
    {
        return $this->page;
    }

    public function getPerPage(): int
    {
        return $this->perPage;
    }

    public function getLastPage(): int
    {
        if ($this->perPage <= 0) {
            return 1;
        }
        return (int) ceil($this->total / $this->perPage);
    }
}
