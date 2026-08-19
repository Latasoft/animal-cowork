<?php

namespace App\Services\MeetingRooms;

use App\Contracts\MeetingRooms\ReservationPaymentGateway;
use Carbon\CarbonImmutable;

class SimulatedReservationPaymentGateway implements ReservationPaymentGateway
{
    /** @return array{status: string, paid_at: CarbonImmutable|null} */
    public function approve(int $amount): array
    {
        return [
            'status' => $amount === 0 ? 'waived' : 'paid',
            'paid_at' => $amount === 0 ? null : now(),
        ];
    }
}
