<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Inertia\Inertia;
use Inertia\Response;

class MeetingRoomBookingController extends Controller
{
    public function index(): Response
    {
        $rooms = Room::query()
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
            ]);

        return Inertia::render('meeting-room-booking', [
            'rooms' => $rooms,
        ]);
    }
}
