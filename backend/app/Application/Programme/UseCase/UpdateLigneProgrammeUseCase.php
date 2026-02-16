<?php

declare(strict_types=1);

namespace App\Application\Programme\UseCase;

use App\Application\Programme\Dto\LigneProgrammeDto;
use App\Domain\Exception\NotFoundException;
use App\Domain\Programme\Entity\LigneProgramme;
use App\Domain\Programme\Repository\ProgrammeRepositoryInterface;

final class UpdateLigneProgrammeUseCase
{
    public function __construct(
        private readonly ProgrammeRepositoryInterface $programmeRepository,
    ) {
    }

    public function execute(string $id, LigneProgrammeDto $dto): void
    {
        $ligne = $this->programmeRepository->getById($id);
        if ($ligne === null) {
            throw new NotFoundException('Ligne de programme non trouvée.');
        }
        $ligne = $ligne->withNombre($dto->nombre)->withSurfacePersonnalisee($dto->surfacePersonnalisee);
        $this->programmeRepository->save($ligne);
    }
}
