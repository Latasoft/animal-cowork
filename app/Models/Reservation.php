<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property CarbonImmutable $starts_at
 * @property CarbonImmutable $ends_at
 * @property int $duration_minutes
 * @property int $included_minutes_used
 * @property int $billable_minutes
 * @property int $rate_per_hour_net
 * @property int $subtotal_net
 * @property int $tax_amount
 * @property int $total_amount
 * @property string $payment_status
 * @property string $status
 * @property string $contact_email
 * @property-read Room $room
 * @property-read Client|null $client
 * @property-read Subscription|null $subscription
 */
class Reservation extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_CONFIRMED = 'confirmed';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_CANCELLED = 'cancelled';

    public const STATUS_NO_SHOW = 'no_show';

    public const PAYMENT_UNPAID = 'unpaid';

    public const PAYMENT_PENDING = 'pending';

    public const PAYMENT_PAID = 'paid';

    public const PAYMENT_WAIVED = 'waived';

    public const RATE_CLIENT = 'client';

    public const RATE_PUBLIC = 'public';

    public const BLOCKING_STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_CONFIRMED,
        self::STATUS_COMPLETED,
        self::STATUS_NO_SHOW,
    ];

    public const CONSUMED_BENEFIT_STATUSES = [
        self::STATUS_CONFIRMED,
        self::STATUS_COMPLETED,
        self::STATUS_NO_SHOW,
    ];

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

    /** @return BelongsTo<Room, $this> */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    /** @return BelongsTo<Client, $this> */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /** @return BelongsTo<Subscription, $this> */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    /** @return BelongsTo<User, $this> */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }
}
