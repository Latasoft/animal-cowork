<?php

namespace App\Services\MeetingRooms;

use App\Models\Room;
use App\Models\Subscription;

class ReservationPricingService
{
    /**
     * @return array{rate_type: string, requested_minutes: int, included_minutes_used: int, billable_minutes: int, rate_per_hour_net: int, tax_rate: float, subtotal_net: int, tax_amount: int, total_amount: int}
     */
    public function quote(
        Room $room,
        int $requestedMinutes,
        ?Subscription $subscription,
        int $availableIncludedMinutes,
    ): array {
        $hasPlan = $subscription !== null;
        $includedMinutesUsed = $hasPlan
            ? min($requestedMinutes, $availableIncludedMinutes)
            : 0;
        $billableMinutes = $requestedMinutes - $includedMinutesUsed;
        $hourlyRate = $hasPlan
            ? (int) $subscription->extra_room_hour_price_net
            : $room->normal_hour_price_net;
        $isTaxable = $hasPlan
            ? $subscription->extra_room_hour_taxable
            : $room->normal_hour_taxable;
        $subtotalNet = (int) round(($billableMinutes / 60) * $hourlyRate);
        $taxRate = $isTaxable ? 0.19 : 0.0;
        $taxAmount = (int) round($subtotalNet * $taxRate);

        return [
            'rate_type' => $hasPlan ? 'client' : 'public',
            'requested_minutes' => $requestedMinutes,
            'included_minutes_used' => $includedMinutesUsed,
            'billable_minutes' => $billableMinutes,
            'rate_per_hour_net' => $hourlyRate,
            'tax_rate' => $taxRate,
            'subtotal_net' => $subtotalNet,
            'tax_amount' => $taxAmount,
            'total_amount' => $subtotalNet + $taxAmount,
        ];
    }
}
