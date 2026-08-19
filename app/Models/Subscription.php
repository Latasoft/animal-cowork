<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $monthly_room_minutes_included
 * @property int|null $extra_room_hour_price_net
 * @property bool $extra_room_hour_taxable
 * @property-read Plan $plan
 */
class Subscription extends Model
{
    public const STATUS_ACTIVE = 'active';

    protected $fillable = [
        'client_id',
        'plan_id',

        'starts_at',
        'ends_at',
        'status',

        'price_office',
        'price_additional',

        'includes_room_access',
        'monthly_room_minutes_included',
        'room_minutes_rollover',
        'extra_room_hour_price_net',
        'extra_room_hour_taxable',

        'previous_subscription_id',

        'notes',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'date',
            'ends_at' => 'date',

            'price_office' => 'integer',
            'price_additional' => 'integer',

            'includes_room_access' => 'boolean',
            'monthly_room_minutes_included' => 'integer',
            'room_minutes_rollover' => 'boolean',
            'extra_room_hour_price_net' => 'integer',
            'extra_room_hour_taxable' => 'boolean',
        ];
    }

    /** @return BelongsTo<Client, $this> */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /** @return BelongsTo<Plan, $this> */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /** @return BelongsTo<Subscription, $this> */
    public function previousSubscription(): BelongsTo
    {
        return $this->belongsTo(
            Subscription::class,
            'previous_subscription_id'
        );
    }

    public function getTotalPriceAttribute(): int
    {
        return $this->price_office + $this->price_additional;
    }

    /** @return HasMany<Reservation, $this> */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
