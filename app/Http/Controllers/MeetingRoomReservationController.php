<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingRooms\StoreReservationRequest;
use App\Models\Reservation;
use App\Services\MeetingRooms\ReservationService;
use App\Services\Payments\PaymentService;
use App\Support\SafeDatabaseQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class MeetingRoomReservationController extends Controller
{
    public function __construct(
        private ReservationService $reservationService,
        private SafeDatabaseQuery $database,
        private PaymentService $payments,
    ) {}

    public function store(StoreReservationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $operation = PaymentController::operation($request, 'reservation_'.hash('sha256', json_encode($data, JSON_THROW_ON_ERROR)));
        $result = $this->database->run(
            callback: fn (): Reservation => DB::transaction(function () use ($data, $operation): Reservation {
                $reservation = $this->reservationService->confirm($data, $operation);
                if ($reservation->total_amount > 0) {
                    $this->payments->pending($reservation, $reservation->total_amount, $operation);
                }

                return $reservation;
            }, attempts: 5),
            fallback: null,
            component: 'meeting_rooms.reservation',
            model: Reservation::class,
            operation: 'confirm_reservation',
        );

        if ($result->unavailable) {
            return response()->json([
                'message' => 'No pudimos verificar la reserva en este momento. Consulta el estado antes de iniciar otro pago.',
                'unavailable' => true,
            ], 503);
        }

        $reservation = $result->value;
        assert($reservation instanceof Reservation);

        $payment = $reservation->payments()->first();
        if ($payment) {
            $payment = $this->payments->start($payment);
            PaymentController::remember($request, $payment);
        }

        return response()->json([
            'redirect_url' => $payment ? route('payments.redirect', $payment) : null,
            'message' => $payment ? 'Continúa a Webpay para pagar tu reserva.' : 'Tu reserva fue confirmada correctamente.',
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
