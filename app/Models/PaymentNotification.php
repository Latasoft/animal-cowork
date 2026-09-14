<?php

namespace App\Models;

use Database\Factories\PaymentNotificationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/** @property array<string, mixed> $payload */
class PaymentNotification extends Model
{
    /** @use HasFactory<PaymentNotificationFactory> */
    use HasFactory;

    protected $fillable = ['notifiable_type', 'notifiable_id', 'event', 'recipient_type', 'recipient', 'payload', 'status', 'sending_at', 'sent_at'];

    protected $hidden = ['payload', 'recipient'];

    protected $attributes = ['status' => 'pending'];

    protected function casts(): array
    {
        return ['payload' => 'encrypted:array', 'sending_at' => 'immutable_datetime', 'sent_at' => 'immutable_datetime'];
    }

    /** @return MorphTo<Model, $this> */
    public function notifiable(): MorphTo
    {
        return $this->morphTo();
    }
}
