<?php

declare(strict_types=1);

namespace App\Domain\Terrain\Entity;

final class Terrain
{
    public function __construct(
        private string $id,
        private string $clientId,
        private ?string $adresse = null,
        private ?float $superficie = null,
        private ?string $titreFoncier = null,
        private ?string $site = null,
        private ?string $situation = null,
        private ?string $topographie = null,
    ) {
    }

    public function getId(): string { return $this->id; }
    public function getClientId(): string { return $this->clientId; }
    public function getAdresse(): ?string { return $this->adresse; }
    public function getSuperficie(): ?float { return $this->superficie; }
    public function getTitreFoncier(): ?string { return $this->titreFoncier; }
    public function getSite(): ?string { return $this->site; }
    public function getSituation(): ?string { return $this->situation; }
    public function getTopographie(): ?string { return $this->topographie; }

    public function withAdresse(?string $v): self { $c = clone $this; $c->adresse = $v; return $c; }
    public function withSuperficie(?float $v): self { $c = clone $this; $c->superficie = $v; return $c; }
    public function withTitreFoncier(?string $v): self { $c = clone $this; $c->titreFoncier = $v; return $c; }
    public function withSite(?string $v): self { $c = clone $this; $c->site = $v; return $c; }
    public function withSituation(?string $v): self { $c = clone $this; $c->situation = $v; return $c; }
    public function withTopographie(?string $v): self { $c = clone $this; $c->topographie = $v; return $c; }
}
