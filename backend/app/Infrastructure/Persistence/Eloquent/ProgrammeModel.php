<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Eloquent;

use App\Infrastructure\Persistence\HasShortId;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgrammeModel extends Model
{
    use HasShortId;

    protected $table = 'programme_lignes';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'produit_id', 'piece_id', 'nombre', 'surface_personnalisee'];
    protected $casts = ['nombre' => 'integer', 'surface_personnalisee' => 'float'];

    public static function boot(): void
    {
        parent::boot();
        static::creating(function (ProgrammeModel $m): void {
            if (empty($m->id)) $m->id = self::generateShortId();
        });
    }

    public function produit(): BelongsTo
    {
        return $this->belongsTo(ProduitModel::class, 'produit_id');
    }

    public function piece(): BelongsTo
    {
        return $this->belongsTo(PieceModel::class, 'piece_id');
    }
}
