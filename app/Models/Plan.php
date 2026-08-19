<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $slug
 * @property string $name
 */
class Plan extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug',
        'name',
        'badge',

        'price_office',
        'price_additional',

        'contract_duration_months',

        'features',

        'includes_room_access',
        'monthly_room_minutes_included',
        'room_minutes_rollover',
        'extra_room_hour_price_net',
        'extra_room_hour_taxable',

        'image_path',
        'image_alt',
        'theme',

        'is_featured',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price_office' => 'integer',
            'price_additional' => 'integer',

            'contract_duration_months' => 'integer',

            'features' => 'array',

            'includes_room_access' => 'boolean',
            'monthly_room_minutes_included' => 'integer',
            'room_minutes_rollover' => 'boolean',
            'extra_room_hour_price_net' => 'integer',
            'extra_room_hour_taxable' => 'boolean',

            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function getTotalPriceAttribute(): int
    {
        return $this->price_office + $this->price_additional;
    }

    /** @return HasMany<Subscription, $this> */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
}
