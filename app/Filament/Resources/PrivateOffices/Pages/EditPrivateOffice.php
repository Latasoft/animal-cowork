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

    /**
     * Imagen que tenía la oficina antes de guardar los cambios.
     */
    protected ?string $oldImage = null;

    /**
     * Procesa los datos del formulario antes de guardar el registro.
     */
    protected function mutateFormDataBeforeSave(array $data): array
    {
        /** @var PrivateOffice $record */
        $record = $this->record;

        /*
         * Guardamos la imagen anterior para poder eliminarla
         * después si el usuario la reemplaza.
         */
        $this->oldImage = $record->getRawOriginal('image');

        /*
         * `new_image` es únicamente el campo utilizado para
         * seleccionar una nueva imagen.
         *
         * Si el usuario no seleccionó ninguna, conservamos
         * explícitamente la imagen actual.
         */
        if (
            ! isset($data['new_image'])
            || $data['new_image'] === null
            || $data['new_image'] === ''
        ) {
            $data['image'] = $this->oldImage;
        } else {
            /*
             * Se seleccionó una nueva imagen.
             *
             * FileUpload guarda el archivo y devuelve su ruta,
             * por ejemplo:
             *
             * private-offices/oficina-4.webp
             */
            $data['image'] = $data['new_image'];
        }

        /*
         * `new_image` es solamente un campo auxiliar del formulario.
         * No existe como columna en la tabla.
         */
        unset($data['new_image']);

        return $data;
    }

    /**
     * Después de guardar:
     *
     * Si la imagen cambió, elimina la anterior del storage.
     *
     * Las imágenes estáticas de /images/... nunca se eliminan.
     */
    protected function afterSave(): void
    {
        /** @var PrivateOffice $record */
        $record = $this->record;

        $newImage = $record->getRawOriginal('image');

        /*
         * No hacemos nada si:
         *
         * - No había imagen anterior.
         * - La imagen no cambió.
         * - La imagen anterior era estática.
         */
        if (
            ! $this->oldImage
            || ! $newImage
            || $this->oldImage === $newImage
            || str_starts_with($this->oldImage, '/images/')
        ) {
            return;
        }

        Storage::disk('public')->delete($this->oldImage);
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