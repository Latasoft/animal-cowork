<?php

namespace App\Filament\Resources\CompanyFormationServices\Pages;

use App\Filament\Resources\CompanyFormationServices\CompanyFormationServiceResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditCompanyFormationService extends EditRecord
{
    protected static string $resource = CompanyFormationServiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),

            ForceDeleteAction::make(),

            RestoreAction::make(),
        ];
    }
}