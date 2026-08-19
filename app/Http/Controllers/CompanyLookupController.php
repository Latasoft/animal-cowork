<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingRooms\LookupCompanyRequest;
use App\Models\Room;
use App\Services\MeetingRooms\CompanyLookupService;
use App\Services\MeetingRooms\ReservationPricingService;
use App\Services\MeetingRooms\RoomAvailabilityService;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;

class CompanyLookupController extends Controller
{
    public function __invoke(
        LookupCompanyRequest $request,
        CompanyLookupService $companyLookupService,
        RoomAvailabilityService $availabilityService,
        ReservationPricingService $pricingService,
    ): JsonResponse {
        $validated = $request->validated();
        $date = CarbonImmutable::parse($validated['date']);
        $room = Room::query()->active()->where('slug', $validated['room'])->firstOrFail();
        $selection = $availabilityService->resolveSelection(
            $room,
            $date,
            $validated['slot_ids'],
        );
        $companyContext = $validated['customer_type'] === 'plan'
            ? $companyLookupService->context($validated['company_rut'], $date)
            : [
                'client' => null,
                'subscription' => null,
                'available_included_minutes' => 0,
                'used_included_minutes' => 0,
            ];
        $quote = $pricingService->quote(
            $room,
            $selection['duration_minutes'],
            $companyContext['subscription'],
            $companyContext['available_included_minutes'],
        );

        return response()->json([
            'company' => $companyLookupService->publicSummary($companyContext),
            'quote' => $quote,
        ]);
    }
}
