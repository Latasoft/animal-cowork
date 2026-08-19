<?php

namespace App\Contracts\MeetingRooms;

use Carbon\CarbonImmutable;

interface ReservationPaymentGateway
{
    /** @return array{status: string, paid_at: CarbonImmutable|null} */
    public function approve(int $amount): array;
}
