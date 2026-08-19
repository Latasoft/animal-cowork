<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingRooms\CheckAvailabilityRequest;
use App\Models\Room;
use App\Services\MeetingRooms\RoomAvailabilityService;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;

class RoomAvailabilityController extends Controller
{
    public function __invoke(
        CheckAvailabilityRequest $request,
        RoomAvailabilityService $availabilityService,
    ): JsonResponse {
        $validated = $request->validated();
        $room = Room::query()->active()->where('slug', $validated['room'])->firstOrFail();

        return response()->json([
            'room_id' => $room->slug,
            'date' => $validated['date'],
            'slots' => $availabilityService->availability(
                $room,
                CarbonImmutable::parse($validated['date']),
            ),
        ]);
    }
}
