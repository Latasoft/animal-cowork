<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
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

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

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
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}