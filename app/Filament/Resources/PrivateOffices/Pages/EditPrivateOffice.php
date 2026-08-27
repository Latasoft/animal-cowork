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
     * Imagen que tenía el registro antes de editarlo.
     */
    protected ?string $oldImage = null;

    /**
     * Capturamos la imagen original antes de que Filament
     * procese y guarde los nuevos datos.
     */
    protected function mutateFormDataBeforeSave(array $data): array
    {
        /** @var PrivateOffice $record */
        $record = $this->record;

        $this->oldImage = $record->getRawOriginal('image');

        /*
         * Si el usuario no seleccionó una nueva imagen,
         * conservamos la imagen que ya tenía el registro.
         *
         * Esto evita que FileUpload termine enviando null
         * y sobrescriba la imagen existente.
         */
        if (
            ! isset($data['image'])
            || $data['image'] === null
            || $data['image'] === ''
        ) {
            $data['image'] = $this->oldImage;
        }

        return $data;
    }

    /**
     * Después de guardar:
     *
     * - Si cambió la imagen, elimina la anterior.
     * - Si era una imagen estática /images/..., no la elimina.
     */
    protected function afterSave(): void
    {
        /** @var PrivateOffice $record */
        $record = $this->record;

        $newImage = $record->getRawOriginal('image');

        if (
            $this->oldImage
            && $newImage
            && $this->oldImage !== $newImage
            && ! str_starts_with($this->oldImage, '/images/')
        ) {
            Storage::disk('public')->delete($this->oldImage);
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
