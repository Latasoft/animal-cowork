<?php

namespace App\Models;

use Database\Factories\PurchaseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/** @property array<string, mixed> $snapshot */
class Purchase extends Model
{
    /** @use HasFactory<PurchaseFactory> */
    use HasFactory;

    protected $fillable = ['operation_key', 'request_hash', 'product_type', 'product_id', 'client_id', 'coupon_id', 'coupon_code', 'email', 'phone', 'subtotal_amount', 'discount_amount', 'amount', 'snapshot', 'status', 'flow'];

    protected $hidden = ['operation_key', 'request_hash'];

    protected $attributes = ['status' => 'pending', 'flow' => 'checkout'];

    protected function casts(): array
    {
        return ['snapshot' => 'array', 'amount' => 'integer', 'subtotal_amount' => 'integer', 'discount_amount' => 'integer'];
    }

    /** @return MorphTo<Model, $this> */
    public function product(): MorphTo
    {
        return $this->morphTo()->withTrashed();
    }

    /** @return MorphMany<Payment, $this> */
    public function payments(): MorphMany
    {
        return $this->morphMany(Payment::class, 'payable');
    }

    /** @return BelongsTo<Client, $this> */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /** @return BelongsTo<Coupon, $this> */
    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    /** @return HasOne<Subscription, $this> */
    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class);
    }

    public function purchasedPlan(): Plan
    {
        abort_unless($this->product_type === 'plan', 404);
        $plan = new Plan;
        $plan->setRawAttributes($this->snapshot['plan'], true);
        $plan->exists = true;

        return $plan;
    }
}
