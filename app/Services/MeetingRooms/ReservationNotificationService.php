<?php

namespace App\Services\MeetingRooms;

use App\Models\Reservation;
use App\Services\Payments\PaymentNotificationService;

class ReservationNotificationService
{
    public function __construct(private PaymentNotificationService $notifications) {}

    public function sendConfirmation(Reservation $reservation): void
    {
        foreach (['client' => $reservation->contact_email, 'internal' => config('services.reservations.reception_email')] as $type => $email) {
            $this->notifications->record($reservation, 'reservation_confirmed', $type, $email, []);
        }
    }
}
