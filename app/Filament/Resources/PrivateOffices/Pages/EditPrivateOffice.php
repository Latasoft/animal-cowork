<?php

namespace App\Filament\Resources\PrivateOffices\Pages;

use App\Filament\Resources\PrivateOffices\PrivateOfficeResource;
use App\Models\PrivateOffice;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;

class EditPrivateOffice extends EditRecord
{
    protected static string $resource = PrivateOfficeResource::class;

    protected function afterSave(): void
    {
        /** @var PrivateOffice $record */
        $record = $this->record;

        $oldImage = $this->record->getOriginal('image');
        $newImage = $record->image;

        /*
         * Si la imagen cambió, eliminamos la anterior
         * solamente si estaba almacenada mediante Filament.
         *
         * Las imágenes estáticas ubicadas en /images/ no se eliminan.
         */
        if (
            $oldImage
            && $newImage
            && $oldImage !== $newImage
            && ! str_starts_with($oldImage, '/images/')
        ) {
            Storage::disk('public')->delete($oldImage);
        }
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
