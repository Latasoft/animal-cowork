<?php

namespace App\Filament\Resources\Rooms\Pages;

use App\Filament\Resources\Rooms\RoomResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditRoom extends EditRecord
{
    protected static string $resource = RoomResource::class;

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $newImages = $data['new_images'] ?? [];

        // Nunca permitimos que el campo auxiliar llegue directamente al modelo.
        unset($data['new_images']);

        // Imágenes que ya existen en la base de datos.
        $currentImages = $this->record->images ?? [];

        // Aseguramos que siempre trabajemos con arrays.
        if (! is_array($currentImages)) {
            $currentImages = [];
        }

        if (! is_array($newImages)) {
            $newImages = [];
        }

        // Agregamos las nuevas imágenes a las existentes.
        $data['images'] = array_values(
            array_unique(
                array_merge($currentImages, $newImages)
            )
        );

        return $data;
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}