<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Eloquent;

use App\Infrastructure\Persistence\HasShortId;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProduitModel extends Model
{
    use HasShortId;

    protected $table = 'produits';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'terrain_id', 'type_produit', 'materiaux', 'standing', 'budget_previsionnel',
        'date_debut_travaux', 'date_fin_travaux', 'caracteristiques',
    ];

    protected $casts = [
        'budget_previsionnel' => 'float',
        'caracteristiques' => 'array',
    ];

    public static function boot(): void
    {
        parent::boot();
        static::creating(function (ProduitModel $m): void {
            if (empty($m->id)) $m->id = self::generateShortId();
        });
    }

    public function terrain(): BelongsTo
    {
        return $this->belongsTo(TerrainModel::class, 'terrain_id');
    }
}
