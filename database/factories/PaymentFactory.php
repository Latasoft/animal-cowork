<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Purchase;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Payment> */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        $token = Str::random(64);

        return ['public_id' => (string) Str::uuid(), 'idempotency_key' => (string) Str::uuid(),
            'payable_type' => 'purchase', 'payable_id' => Purchase::factory(), 'amount' => 59990,
            'environment' => 'integration', 'buy_order' => (string) Str::ulid(), 'session_id' => (string) Str::uuid(),
            'token' => $token, 'token_hash' => hash('sha256', $token), 'expires_at' => now()->addMinutes(15)];
    }
}
