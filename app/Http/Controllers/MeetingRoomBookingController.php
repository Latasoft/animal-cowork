<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Support\SafeDatabaseQuery;
use Inertia\Inertia;
use Inertia\Response;

class MeetingRoomBookingController extends Controller
{
    public function __construct(private SafeDatabaseQuery $database) {}

    public function index(): Response
    {
        $rooms = $this->database->run(
            callback: fn (): array => Room::query()
                ->active()
                ->orderBy('sort_order')
                ->get([
                    'slug',
                    'name',
                    'short_name',
                    'description',
                    'capacity',
                    'location',
                    'images',
                    'image_alt',
                    'features',
                    'normal_hour_price_net',
                    'normal_hour_taxable',
                ])
                ->map(fn (Room $room): array => [
                    'id' => $room->slug,
                    'name' => $room->name,
                    'shortName' => $room->short_name,
                    'description' => $room->description,
                    'capacity' => $room->capacity,
                    'location' => $room->location,
                    'images' => $room->images,
                    'imageAlt' => $room->image_alt,
                    'features' => $room->features,
                    'normalHourlyRate' => $room->normal_hour_price_net,
                    'normalHourlyRateTaxable' => $room->normal_hour_taxable,
                ])
                ->values()
                ->all(),
            fallback: [],
            component: 'meeting_rooms.catalog',
            model: Room::class,
            operation: 'list_active_rooms',
        );

        return Inertia::render('meeting-room-booking', [
            'rooms' => $rooms->value,
            'roomsUnavailable' => $rooms->unavailable,
        ]);
    }
}
