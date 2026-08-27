<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $slug
 * @property int $normal_hour_price_net
 * @property bool $normal_hour_taxable
 * @property array<int, array{id: string, start: string, end: string, billable_minutes: int}> $time_slots
 */
class Room extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug',
        'name',
        'short_name',

        'description',
        'capacity',
        'location',

        'images',
        'image_alt',
        'features',

        'normal_hour_price_net',
        'normal_hour_taxable',

        'time_slots',

        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'capacity' => 'integer',

            'images' => 'array',
            'features' => 'array',
            'time_slots' => 'array',

            'normal_hour_price_net' => 'integer',
            'normal_hour_taxable' => 'boolean',

            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /** @return HasMany<Reservation, $this> */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
    /**
     * @return HasMany<RoomBlock, $this>
     */
    public function blocks(): HasMany
    {
        return $this->hasMany(RoomBlock::class);
    }

    /** @param Builder<Room> $query */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }
}
