<?php

declare(strict_types=1);

namespace App\Domain\Client\Entity;

/**
 * Entité métier Client. Le domaine ne connaît pas la persistance.
 */
final class Client
{
    public function __construct(
        private string $id,
        private ?string $nom = null,
        private ?string $prenom = null,
        private ?string $email = null,
        private ?string $telephone = null,
        private ?string $adresse = null,
        private ?string $numeroRegistre = null,
        private ?string $simulationPaymentStatus = null,
        private ?string $simulationPaidAt = null,
        private ?string $createdAt = null,
    ) {
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function getNumeroRegistre(): ?string
    {
        return $this->numeroRegistre;
    }

    public function getSimulationPaymentStatus(): ?string
    {
        return $this->simulationPaymentStatus;
    }

    public function getSimulationPaidAt(): ?string
    {
        return $this->simulationPaidAt;
    }

    public function getCreatedAt(): ?string
    {
        return $this->createdAt;
    }

    public function withNom(?string $nom): self
    {
        $clone = clone $this;
        $clone->nom = $nom;
        return $clone;
    }

    public function withPrenom(?string $prenom): self
    {
        $clone = clone $this;
        $clone->prenom = $prenom;
        return $clone;
    }

    public function withEmail(?string $email): self
    {
        $clone = clone $this;
        $clone->email = $email;
        return $clone;
    }

    public function withTelephone(?string $telephone): self
    {
        $clone = clone $this;
        $clone->telephone = $telephone;
        return $clone;
    }

    public function withAdresse(?string $adresse): self
    {
        $clone = clone $this;
        $clone->adresse = $adresse;
        return $clone;
    }

    public function withNumeroRegistre(?string $numeroRegistre): self
    {
        $clone = clone $this;
        $clone->numeroRegistre = $numeroRegistre;
        return $clone;
    }

    public function withSimulationPaymentStatus(?string $status): self
    {
        $clone = clone $this;
        $clone->simulationPaymentStatus = $status;
        return $clone;
    }

    public function withSimulationPaidAt(?string $paidAt): self
    {
        $clone = clone $this;
        $clone->simulationPaidAt = $paidAt;
        return $clone;
    }
}
