<?php

declare(strict_types=1);

namespace App\Application\Programme\UseCase;

use App\Application\Programme\Dto\LigneProgrammeDto;
use App\Domain\Exception\NotFoundException;
use App\Domain\Piece\Repository\PieceRepositoryInterface;
use App\Domain\Produit\Repository\ProduitRepositoryInterface;
use App\Domain\Programme\Entity\LigneProgramme;
use App\Domain\Programme\Repository\ProgrammeRepositoryInterface;

final class AddLigneProgrammeUseCase
{
    public function __construct(
        private readonly ProgrammeRepositoryInterface $programmeRepository,
        private readonly ProduitRepositoryInterface $produitRepository,
        private readonly PieceRepositoryInterface $pieceRepository,
    ) {
    }

    public function execute(string $produitId, LigneProgrammeDto $dto): string
    {
        if ($this->produitRepository->getById($produitId) === null) {
            throw new NotFoundException('Produit non trouvé.');
        }
        if ($this->pieceRepository->getById($dto->pieceId) === null) {
            throw new NotFoundException('Pièce non trouvée.');
        }
        $id = $this->programmeRepository->nextIdentity();
        $ligne = new LigneProgramme(
            id: $id,
            produitId: $produitId,
            pieceId: $dto->pieceId,
            nombre: $dto->nombre,
            surfacePersonnalisee: $dto->surfacePersonnalisee,
        );
        $this->programmeRepository->save($ligne);
        return $id;
    }
}
