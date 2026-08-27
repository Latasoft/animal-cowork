<?php

namespace App\Services\MeetingRooms;

use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomBlock;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class RoomAvailabilityService
{
    /**
     * @return array<int, array{
     *     id: string,
     *     start: string,
     *     end: string,
     *     operational_end: string,
     *     billable_minutes: int,
     *     available: bool
     * }>
     */
    public function availability(Room $room, CarbonImmutable $date): array
    {
        $this->ensureBookableDate($date);

        /*
        |--------------------------------------------------------------------------
        | Reservas existentes
        |--------------------------------------------------------------------------
        */

        $reservations = Reservation::query()
            ->select([
                'id',
                'starts_at',
                'ends_at',
            ])
            ->where('room_id', $room->id)
            ->whereIn('status', Reservation::BLOCKING_STATUSES)
            ->where('starts_at', '<', $date->endOfDay())
            ->where('ends_at', '>', $date->startOfDay())
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Bloqueos administrativos
        |--------------------------------------------------------------------------
        |
        | Un bloqueo puede ser:
        |
        | - Para una parte del día.
        | - Para toda la jornada.
        |
        | Solo consideramos bloqueos activos.
        |
        */

        $roomBlocks = RoomBlock::query()
            ->select([
                'id',
                'starts_at',
                'ends_at',
            ])
            ->where('room_id', $room->id)
            ->where('is_active', true)
            ->where('starts_at', '<', $date->endOfDay())
            ->where('ends_at', '>', $date->startOfDay())
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Construcción de horarios
        |--------------------------------------------------------------------------
        */

        return collect($room->time_slots ?? [])
            ->map(function (array $slot) use (
                $date,
                $reservations,
                $roomBlocks
            ): array {
                $startsAt = $this->dateTime(
                    $date,
                    $slot['start']
                );

                $endsAt = $this->dateTime(
                    $date,
                    $slot['end']
                );

                $billableMinutes = (int) $slot['billable_minutes'];

                $blockedByReservation = $this->overlaps(
                    $reservations,
                    $startsAt,
                    $endsAt
                );

                $blockedByRoomBlock = $this->overlaps(
                    $roomBlocks,
                    $startsAt,
                    $endsAt
                );

                return [
                    'id' => (string) $slot['id'],

                    'start' => $startsAt->format('H:i'),

                    'end' => $startsAt
                        ->addMinutes($billableMinutes)
                        ->format('H:i'),

                    'operational_end' => $endsAt->format('H:i'),

                    'billable_minutes' => $billableMinutes,

                    'available' =>
                        ! $blockedByReservation
                        && ! $blockedByRoomBlock,
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @param array<int, string> $slotIds
     *
     * @return array{
     *     starts_at: CarbonImmutable,
     *     ends_at: CarbonImmutable,
     *     commercial_ends_at: CarbonImmutable,
     *     duration_minutes: int
     * }
     */
    public function resolveSelection(
        Room $room,
        CarbonImmutable $date,
        array $slotIds
    ): array {
        $availableSlots = collect(
            $this->availability($room, $date)
        );

        /*
        |--------------------------------------------------------------------------
        | Validar que los horarios pertenecen a la sala
        |--------------------------------------------------------------------------
        */

        $selectedSlots = $availableSlots
            ->filter(
                fn (array $slot): bool => in_array(
                    $slot['id'],
                    $slotIds,
                    true
                )
            )
            ->values();

        if ($selectedSlots->count() !== count($slotIds)) {
            throw ValidationException::withMessages([
                'slot_ids' =>
                    'Uno de los horarios seleccionados no pertenece a esta sala.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Validar disponibilidad
        |--------------------------------------------------------------------------
        |
        | Aquí también quedan protegidos los RoomBlock.
        |
        */

        if (
            $selectedSlots->contains(
                fn (array $slot): bool => ! $slot['available']
            )
        ) {
            throw ValidationException::withMessages([
                'slot_ids' =>
                    'Este horario no está disponible. Puede haber sido reservado o bloqueado recientemente. Selecciona otro horario.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Validar continuidad
        |--------------------------------------------------------------------------
        */

        $selectedIndexes = $availableSlots
            ->keys()
            ->filter(
                fn (int $index): bool => in_array(
                    $availableSlots[$index]['id'],
                    $slotIds,
                    true
                )
            )
            ->values();

        if (
            $selectedIndexes->count() > 1
            && $selectedIndexes->last()
                - $selectedIndexes->first()
                + 1
                !== $selectedIndexes->count()
        ) {
            throw ValidationException::withMessages([
                'slot_ids' =>
                    'Los horarios seleccionados deben ser consecutivos.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Resolver rango final
        |--------------------------------------------------------------------------
        */

        $firstSlot = $selectedSlots->first();

        $lastSlot = $selectedSlots->last();

        return [
            'starts_at' => $this->dateTime(
                $date,
                $firstSlot['start']
            ),

            'ends_at' => $this->dateTime(
                $date,
                $lastSlot['operational_end']
            ),

            'commercial_ends_at' => $this->dateTime(
                $date,
                $lastSlot['end']
            ),

            'duration_minutes' => $selectedSlots->sum(
                'billable_minutes'
            ),
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Validar fecha
    |--------------------------------------------------------------------------
    */

    private function ensureBookableDate(
        CarbonImmutable $date
    ): void {
        if ($date->isWeekend()) {
            throw ValidationException::withMessages([
                'date' =>
                    'Las salas no están disponibles los fines de semana.',
            ]);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Detectar solapamiento
    |--------------------------------------------------------------------------
    */

    /**
     * @param Collection<int, object> $items
     */
    private function overlaps(
        Collection $items,
        CarbonImmutable $startsAt,
        CarbonImmutable $endsAt
    ): bool {
        return $items->contains(
            fn ($item): bool =>
                $item->starts_at->lt($endsAt)
                && $item->ends_at->gt($startsAt)
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Construir fecha + hora
    |--------------------------------------------------------------------------
    */

    private function dateTime(
        CarbonImmutable $date,
        string $time
    ): CarbonImmutable {
        return $date->setTimeFromTimeString($time);
    }
}