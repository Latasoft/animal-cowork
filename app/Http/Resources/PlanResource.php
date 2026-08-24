<?php

namespace App\Http\Resources;

use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Plan */
class PlanResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'badge' => $this->badge,
            'priceOffice' => $this->price_office,
            'priceAdditional' => $this->price_additional,
            'totalPrice' => $this->total_price,
            'contractDurationMonths' => $this->contract_duration_months,
            'features' => $this->features,
            'includesRoomAccess' => $this->includes_room_access,
            'monthlyRoomMinutesIncluded' => $this->monthly_room_minutes_included,
            'roomMinutesRollover' => $this->room_minutes_rollover,
            'extraRoomHourPriceNet' => $this->extra_room_hour_price_net,
            'extraRoomHourTaxable' => $this->extra_room_hour_taxable,
            'image' => $this->image_url,
            'fallbackImage' => $this->fallback_image_url,
            'imageAlt' => $this->image_alt ?: "Ilustración del plan {$this->name}",
            'theme' => array_key_exists((string) $this->theme, Plan::THEMES)
                ? $this->theme
                : 'green',
            'featured' => $this->is_featured,
            'active' => $this->is_active,
            'sortOrder' => $this->sort_order,
        ];
    }
}
