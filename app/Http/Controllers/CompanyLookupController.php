<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingRooms\LookupCompanyRequest;
use App\Models\Room;
use App\Services\MeetingRooms\CompanyLookupService;
use App\Services\MeetingRooms\ReservationPricingService;
use App\Services\MeetingRooms\RoomAvailabilityService;
use App\Support\SafeDatabaseQuery;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class CompanyLookupController extends Controller
{
    public function __construct(
        private CompanyLookupService $companyLookupService,
        private RoomAvailabilityService $availabilityService,
        private ReservationPricingService $pricingService,
        private SafeDatabaseQuery $database,
    ) {}

    public function __invoke(LookupCompanyRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $lookup = $this->database->run(
            callback: function () use ($validated): array {
                $date = CarbonImmutable::parse($validated['date']);
                $room = Room::query()
                    ->active()
                    ->where('slug', $validated['room'])
                    ->first();

                if (! $room) {
                    throw ValidationException::withMessages([
                        'room' => 'La sala seleccionada no está disponible.',
                    ]);
                }

                $selection = $this->availabilityService->resolveSelection(
                    $room,
                    $date,
                    $validated['slot_ids'],
                );
                $companyContext = $validated['customer_type'] === 'plan'
                    ? $this->companyLookupService->context($validated['company_rut'], $date)
                    : [
                        'client' => null,
                        'subscription' => null,
                        'available_included_minutes' => 0,
                        'used_included_minutes' => 0,
                    ];
                $quote = $this->pricingService->quote(
                    $room,
                    $selection['duration_minutes'],
                    $companyContext['subscription'],
                    $companyContext['available_included_minutes'],
                );

                return [
                    'company' => $this->companyLookupService->publicSummary($companyContext),
                    'quote' => $quote,
                ];
            },
            fallback: null,
            component: 'meeting_rooms.company_lookup',
            model: Room::class,
            operation: 'lookup_company_and_quote',
        );

        if ($lookup->unavailable) {
            return response()->json([
                'message' => 'No pudimos validar los datos de la empresa en este momento.',
                'unavailable' => true,
            ], 503);
        }

        return response()->json($lookup->value);
    }
}
