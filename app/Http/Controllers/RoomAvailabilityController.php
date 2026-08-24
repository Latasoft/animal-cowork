<?php

namespace App\Http\Controllers;

use App\Http\Requests\MeetingRooms\CheckAvailabilityRequest;
use App\Models\Room;
use App\Services\MeetingRooms\RoomAvailabilityService;
use App\Support\SafeDatabaseQuery;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class RoomAvailabilityController extends Controller
{
    public function __construct(
        private RoomAvailabilityService $availabilityService,
        private SafeDatabaseQuery $database,
    ) {}

    public function __invoke(
        CheckAvailabilityRequest $request,
    ): JsonResponse {
        $validated = $request->validated();
        $availability = $this->database->run(
            callback: function () use ($validated): array {
                $room = Room::query()
                    ->active()
                    ->where('slug', $validated['room'])
                    ->first();

                if (! $room) {
                    throw ValidationException::withMessages([
                        'room' => 'La sala seleccionada no está disponible.',
                    ]);
                }

                return [
                    'room_id' => $room->slug,
                    'date' => $validated['date'],
                    'slots' => $this->availabilityService->availability(
                        $room,
                        CarbonImmutable::parse($validated['date']),
                    ),
                ];
            },
            fallback: null,
            component: 'meeting_rooms.availability',
            model: Room::class,
            operation: 'load_room_availability',
        );

        if ($availability->unavailable) {
            return response()->json([
                'message' => 'No pudimos consultar la disponibilidad en este momento.',
                'unavailable' => true,
                'slots' => [],
            ], 503);
        }

        return response()->json($availability->value);
    }
}
