<?php

namespace App\Filament\Resources\Rooms\Pages;

use App\Filament\Resources\Rooms\RoomResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;

class EditRoom extends EditRecord
{
    protected static string $resource = RoomResource::class;

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $newImages = $data['new_images'] ?? [];

        unset($data['new_images']);

        $currentImages = $this->record->images ?? [];

        if (! is_array($currentImages)) {
            $currentImages = [];
        }

        if (! is_array($newImages)) {
            $newImages = [];
        }

        $data['images'] = array_values(
            array_unique(
                array_merge($currentImages, $newImages)
            )
        );

        return $data;
    }

    public function removeImage(int $index): void
    {
        $images = $this->record->images ?? [];

        if (! is_array($images) || ! array_key_exists($index, $images)) {
            return;
        }

        $image = $images[$index];

        // Si es una imagen subida al storage público,
        // eliminamos también el archivo físico.
        if (
            is_string($image)
            && ! str_starts_with($image, '/images/')
            && Storage::disk('public')->exists($image)
        ) {
            Storage::disk('public')->delete($image);
        }

        // Eliminamos la imagen del array.
        unset($images[$index]);

        // Reindexamos el array para evitar índices discontinuos.
        $this->record->images = array_values($images);

        // Guardamos inmediatamente el cambio.
        $this->record->save();

        // Recargamos el registro para mantener el estado sincronizado.
        $this->record->refresh();
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