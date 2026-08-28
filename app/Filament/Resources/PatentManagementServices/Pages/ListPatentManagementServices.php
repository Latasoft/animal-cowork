<?php

namespace App\Filament\Resources\PatentManagementServices\Pages;

use App\Filament\Resources\PatentManagementServices\PatentManagementServiceResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPatentManagementServices extends ListRecords
{
    protected static string $resource = PatentManagementServiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}