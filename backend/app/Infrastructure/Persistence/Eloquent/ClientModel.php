<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Eloquent;

use App\Infrastructure\Persistence\HasShortId;
use Illuminate\Database\Eloquent\Model;

/**
 * Modèle Eloquent Client. Utilisé uniquement dans Infrastructure.
 * Clé primaire string, non auto-incrémentée.
 */
class ClientModel extends Model
{
    use HasShortId;

    protected $table = 'clients';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'nom',
        'prenom',
        'email',
        'telephone',
        'adresse',
        'numero_registre',
        'simulation_payment_status',
        'simulation_paid_at',
    ];

    protected $casts = [
        'simulation_paid_at' => 'datetime',
    ];

    public static function boot(): void
    {
        parent::boot();
        static::creating(function (ClientModel $model): void {
            if (empty($model->id)) {
                $model->id = self::generateShortId();
            }
        });
    }
}
