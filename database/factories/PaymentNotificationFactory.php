<?php

namespace Database\Factories;

use App\Models\PaymentNotification;
use App\Models\Purchase;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaymentNotification>
 */
class PaymentNotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'notifiable_type' => 'purchase',
            'notifiable_id' => Purchase::factory(),
            'event' => 'service_paid',
            'recipient_type' => 'client',
            'recipient' => fake()->safeEmail(),
            'payload' => ['name' => 'Servicio de prueba', 'amount' => 50000, 'date' => now()->toIso8601String(), 'reference' => 'TEST'],
            'status' => 'pending',
        ];
    }
}
