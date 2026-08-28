<?php

namespace App\Filament\Resources\PatentManagementServices\Pages;

use App\Filament\Resources\PatentManagementServices\PatentManagementServiceResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewPatentManagementService extends ViewRecord
{
    protected static string $resource = PatentManagementServiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}