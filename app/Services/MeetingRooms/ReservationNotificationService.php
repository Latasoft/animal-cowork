<?php

namespace App\Services\MeetingRooms;

use App\Mail\MeetingRoomReservationConfirmed;
use App\Models\Reservation;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ReservationNotificationService
{
    public function sendConfirmation(Reservation $reservation): void
    {
        $recipients = [
            'client' => $reservation->contact_email,
            'internal' => config('services.reservations.reception_email'),
        ];

        foreach ($recipients as $recipientType => $email) {
            if (! is_string($email) || $email === '') {
                Log::warning('Meeting room confirmation recipient is not configured.', [
                    'reservation_id' => $reservation->id,
                    'recipient_type' => $recipientType,
                ]);

                continue;
            }

            try {
                Mail::to($email)->queue(
                    new MeetingRoomReservationConfirmed($reservation),
                );
            } catch (Throwable $exception) {
                Log::error('Meeting room confirmation email could not be queued.', [
                    'reservation_id' => $reservation->id,
                    'recipient_type' => $recipientType,
                    'exception' => $exception::class,
                ]);
            }
        }
    }
}
