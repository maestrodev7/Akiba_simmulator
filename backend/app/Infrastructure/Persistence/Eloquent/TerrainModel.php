<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Eloquent;

use App\Infrastructure\Persistence\HasShortId;
use Illuminate\Database\Eloquent\Model;

class TerrainModel extends Model
{
    use HasShortId;

    protected $table = 'terrains';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'client_id', 'adresse', 'superficie', 'titre_foncier', 'site', 'situation', 'topographie',
    ];

    protected $casts = ['superficie' => 'float'];

    public static function boot(): void
    {
        parent::boot();
        static::creating(function (TerrainModel $m): void {
            if (empty($m->id)) {
                $m->id = self::generateShortId();
            }
        });
    }
}
