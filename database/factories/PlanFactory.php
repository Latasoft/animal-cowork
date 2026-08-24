<?php

namespace Database\Factories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Plan>
 */
class PlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'slug' => fake()->unique()->slug(2),
            'name' => fake()->unique()->words(2, true),
            'badge' => null,
            'price_office' => fake()->numberBetween(30000, 100000),
            'price_additional' => 0,
            'contract_duration_months' => 12,
            'features' => [
                'Dirección tributaria',
                'Recepción de correspondencia',
            ],
            'includes_room_access' => true,
            'monthly_room_minutes_included' => 120,
            'room_minutes_rollover' => false,
            'extra_room_hour_price_net' => 7000,
            'extra_room_hour_taxable' => true,
            'image_path' => null,
            'image_alt' => null,
            'theme' => 'green',
            'is_featured' => false,
            'is_active' => true,
            'sort_order' => fake()->numberBetween(1, 100),
        ];
    }
}
