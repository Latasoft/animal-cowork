<?php

namespace App\Filament\Resources\CompanyFormationServices\Pages;

use App\Filament\Resources\CompanyFormationServices\CompanyFormationServiceResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCompanyFormationServices extends ListRecords
{
    protected static string $resource = CompanyFormationServiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
