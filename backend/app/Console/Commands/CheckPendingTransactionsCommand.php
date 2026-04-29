<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Application\Payment\Service\PaymentTransactionStatusSyncer;
use Illuminate\Console\Command;

final class CheckPendingTransactionsCommand extends Command
{
    protected $signature = 'transactions:check-pending';
    protected $description = 'Vérifie les transactions pending et met à jour leur statut.';

    public function handle(PaymentTransactionStatusSyncer $syncer): int
    {
        $result = $syncer->syncPendingTransactions();

        $this->info(sprintf(
            'Transactions pending vérifiées: %d, statuts modifiés: %d, erreurs: %d.',
            $result['checked'],
            $result['updated'],
            $result['failed']
        ));

        return self::SUCCESS;
    }
}

