<?php

namespace App\Filament\Resources\PatentManagementServices\Pages;

use App\Filament\Resources\PatentManagementServices\PatentManagementServiceResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditPatentManagementService extends EditRecord
{
    protected static string $resource = PatentManagementServiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),

            ForceDeleteAction::make(),

            RestoreAction::make(),
        ];
    }
}