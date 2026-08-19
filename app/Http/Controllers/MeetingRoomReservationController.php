<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingRooms\StoreReservationRequest;
use App\Models\Reservation;
use App\Services\MeetingRooms\ReservationService;
use Illuminate\Http\JsonResponse;

class MeetingRoomReservationController extends Controller
{
    public function store(
        StoreReservationRequest $request,
        ReservationService $reservationService,
    ): JsonResponse {
        $reservation = $reservationService->confirm($request->validated());

        return response()->json([
            'message' => 'Tu reserva fue confirmada correctamente.',
            'reservation' => $this->summary($reservation),
        ], 201);
    }

    /** @return array<string, mixed> */
    private function summary(Reservation $reservation): array
    {
        return [
            'id' => $reservation->id,
            'room' => $reservation->room->name,
            'company' => $reservation->client?->company_name,
            'date' => $reservation->starts_at->toDateString(),
            'starts_at' => $reservation->starts_at->format('H:i'),
            'ends_at' => $reservation->starts_at
                ->addMinutes($reservation->duration_minutes)
                ->format('H:i'),
            'duration_minutes' => $reservation->duration_minutes,
            'included_minutes_used' => $reservation->included_minutes_used,
            'billable_minutes' => $reservation->billable_minutes,
            'rate_per_hour_net' => $reservation->rate_per_hour_net,
            'subtotal_net' => $reservation->subtotal_net,
            'tax_amount' => $reservation->tax_amount,
            'total_amount' => $reservation->total_amount,
            'payment_status' => $reservation->payment_status,
            'status' => $reservation->status,
        ];
    }
}
