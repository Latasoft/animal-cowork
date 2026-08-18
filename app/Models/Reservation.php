<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    protected $fillable = [
        'room_id',
        'client_id',
        'subscription_id',
        'created_by',

        'contact_name',
        'contact_email',
        'contact_phone',

        'starts_at',
        'ends_at',
        'duration_minutes',

        'rate_type',

        'included_minutes_used',
        'billable_minutes',

        'rate_per_hour_net',
        'tax_rate',

        'subtotal_net',
        'tax_amount',
        'total_amount',

        'payment_status',
        'paid_at',

        'status',
        'confirmed_at',
        'cancelled_at',
        'cancellation_reason',

        'terms_accepted_at',
        'terms_version',

        'notes',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',

            'duration_minutes' => 'integer',

            'included_minutes_used' => 'integer',
            'billable_minutes' => 'integer',

            'rate_per_hour_net' => 'integer',
            'tax_rate' => 'decimal:4',

            'subtotal_net' => 'integer',
            'tax_amount' => 'integer',
            'total_amount' => 'integer',

            'paid_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'cancelled_at' => 'datetime',

            'terms_accepted_at' => 'datetime',
        ];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }
}
