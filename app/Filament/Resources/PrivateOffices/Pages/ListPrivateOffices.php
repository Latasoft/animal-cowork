<?php

namespace App\Filament\Resources\PrivateOffices\Pages;

use App\Filament\Resources\PrivateOffices\PrivateOfficeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPrivateOffices extends ListRecords
{
    protected static string $resource = PrivateOfficeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
