<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\PaymentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable|null $paid_at
 * @property CarbonImmutable|null $create_started_at
 * @property CarbonImmutable|null $commit_started_at
 * @property CarbonImmutable|null $checked_at
 */
class Payment extends Model
{
    /** @use HasFactory<PaymentFactory> */
    use HasFactory;

    public const PAID = 'paid';

    public const PENDING = 'pending';

    public const VERIFYING = 'verifying';

    public const FAILED = 'failed';

    public const CANCELLED = 'cancelled';

    public const EXPIRED = 'expired';

    protected $fillable = ['public_id', 'idempotency_key', 'payable_type', 'payable_id', 'amount', 'currency', 'environment', 'buy_order', 'session_id', 'token', 'token_hash', 'redirect_url', 'redirected_at', 'returned_at', 'status', 'provider_status', 'response_code', 'authorization_code', 'transaction_date', 'paid_at', 'create_started_at', 'commit_started_at', 'checked_at', 'expires_at', 'check_attempts', 'review_reason'];

    protected $hidden = ['token', 'token_hash', 'session_id', 'idempotency_key', 'redirect_url'];

    protected $attributes = ['status' => self::PENDING, 'currency' => 'CLP', 'check_attempts' => 0];

    protected function casts(): array
    {
        return ['redirected_at' => 'immutable_datetime', 'returned_at' => 'immutable_datetime', 'amount' => 'integer', 'token' => 'encrypted', 'transaction_date' => 'immutable_datetime', 'paid_at' => 'immutable_datetime', 'create_started_at' => 'immutable_datetime', 'commit_started_at' => 'immutable_datetime', 'checked_at' => 'immutable_datetime', 'expires_at' => 'immutable_datetime', 'check_attempts' => 'integer'];
    }

    public function getRouteKeyName(): string
    {
        return 'public_id';
    }

    /** @return MorphTo<Model, $this> */
    public function payable(): MorphTo
    {
        return $this->morphTo();
    }

    public function isTerminal(): bool
    {
        return in_array($this->status, [self::PAID, self::FAILED, self::CANCELLED, self::EXPIRED], true);
    }
}
