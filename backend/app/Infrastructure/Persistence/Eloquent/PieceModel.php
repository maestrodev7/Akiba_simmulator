<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Eloquent;

use App\Infrastructure\Persistence\HasShortId;
use Illuminate\Database\Eloquent\Model;

class PieceModel extends Model
{
    use HasShortId;

    protected $table = 'pieces';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'designation', 'surface_standard', 'ordre'];
    protected $casts = ['surface_standard' => 'float'];

    public static function boot(): void
    {
        parent::boot();
        static::creating(function (PieceModel $m): void {
            if (empty($m->id)) $m->id = self::generateShortId();
        });
    }
}
