<?php

namespace Database\Factories;

use App\Models\Plan;
use App\Models\Purchase;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Purchase> */
class PurchaseFactory extends Factory
{
    public function definition(): array
    {
        return ['operation_key' => (string) Str::uuid(), 'request_hash' => hash('sha256', Str::random()),
            'product_type' => 'plan', 'product_id' => Plan::factory(), 'email' => fake()->safeEmail(),
            'phone' => '+56912345678', 'amount' => 59990, 'snapshot' => ['name' => 'Plan de prueba']];
    }
}
