<?php

namespace App\Filament\Resources\Rooms\Pages;

use App\Filament\Resources\Rooms\RoomResource;
use Filament\Resources\Pages\CreateRecord;

class CreateRoom extends CreateRecord
{
    protected static string $resource = RoomResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $newImages = $data['new_images'] ?? [];

        unset($data['new_images']);

        $data['images'] = array_values(
            array_filter($newImages)
        );

        return $data;
    }
}