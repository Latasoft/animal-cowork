<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $sala1TimeSlots = [
            [
                'id' => '10-11',
                'start' => '10:00',
                'end' => '11:10',
                'billable_minutes' => 60,
            ],
            [
                'id' => '11-12',
                'start' => '11:20',
                'end' => '12:30',
                'billable_minutes' => 60,
            ],
            [
                'id' => '12-13',
                'start' => '12:40',
                'end' => '13:50',
                'billable_minutes' => 60,
            ],
            [
                'id' => '14-15',
                'start' => '14:00',
                'end' => '15:10',
                'billable_minutes' => 60,
            ],
            [
                'id' => '15-16',
                'start' => '15:20',
                'end' => '16:30',
                'billable_minutes' => 60,
            ],
            [
                'id' => '16-17',
                'start' => '16:40',
                'end' => '17:50',
                'billable_minutes' => 60,
            ],
            [
                'id' => '18-19',
                'start' => '18:00',
                'end' => '19:10',
                'billable_minutes' => 60,
            ],
        ];

        $sala2TimeSlots = [
            [
                'id' => '18-20',
                'start' => '18:00',
                'end' => '20:00',
                'billable_minutes' => 120,
            ],
        ];

        $commonFeatures = [
            'Aire acondicionado',
            'Conexiones eléctricas',
            'Smart TV de 55"',
            'Pizarra de vidrio',
            'Cafetera',
            'Dispensador de agua',
        ];

        $rooms = [
            [
                'slug' => 'sala-1',
                'name' => 'Sala de Reuniones 1',
                'short_name' => 'Sala 1',

                'description' =>
                    'Sala de reuniones principal de Animal Co-work.',

                'capacity' => 10,
                'location' => 'Animal Co-work',

                'images' => [
                    '/images/rooms/sala1.1.webp',
                    '/images/rooms/sala1.3.webp',
                    '/images/rooms/sala1.4.webp',
                ],

                'image_alt' =>
                    'Sala de reuniones principal de Animal Coworking',

                'features' => $commonFeatures,

                'normal_hour_price_net' => 12000,
                'normal_hour_taxable' => true,

                'time_slots' => $sala1TimeSlots,

                'is_active' => true,
                'sort_order' => 1,
            ],

            [
                'slug' => 'sala-2',
                'name' => 'Sala de Reuniones 2',
                'short_name' => 'Sala 2',

                'description' =>
                    'Sala disponible actualmente solo entre las 18:00 y las 20:00 horas, mediante reserva del bloque completo de 2 horas.',

                'capacity' => 6,
                'location' => 'Animal Co-work',

                'images' => [
                    '/images/rooms/sala2.1.webp',
                    '/images/rooms/sala2.2.webp',
                    '/images/rooms/sala2.3.webp',
                ],

                'image_alt' =>
                    'Sala 2 de Animal Coworking',

                'features' => $commonFeatures,

                'normal_hour_price_net' => 12000,
                'normal_hour_taxable' => true,

                'time_slots' => $sala2TimeSlots,

                'is_active' => true,
                'sort_order' => 2,
            ],
        ];

        foreach ($rooms as $room) {
            Room::updateOrCreate(
                ['slug' => $room['slug']],
                $room,
            );
        }
    }
}