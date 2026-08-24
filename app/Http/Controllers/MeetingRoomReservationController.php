<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingRooms\StoreReservationRequest;
use App\Models\Reservation;
use App\Services\MeetingRooms\ReservationService;
use App\Support\SafeDatabaseQuery;
use Illuminate\Http\JsonResponse;

class MeetingRoomReservationController extends Controller
{
    public function __construct(
        private ReservationService $reservationService,
        private SafeDatabaseQuery $database,
    ) {}

    public function store(StoreReservationRequest $request): JsonResponse
    {
        $result = $this->database->run(
            callback: fn (): Reservation => $this->reservationService->confirm($request->validated()),
            fallback: null,
            component: 'meeting_rooms.reservation',
            model: Reservation::class,
            operation: 'confirm_reservation',
        );

        if ($result->unavailable) {
            return response()->json([
                'message' => 'No pudimos confirmar la reserva en este momento. No se realizó ningún cargo ni reserva.',
                'unavailable' => true,
            ], 503);
        }

        $reservation = $result->value;
        assert($reservation instanceof Reservation);

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
