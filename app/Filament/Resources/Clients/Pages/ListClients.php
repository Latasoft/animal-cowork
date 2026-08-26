<?php

namespace App\Filament\Resources\Clients\Pages;

use App\Filament\Resources\Clients\ClientResource;
use App\Filament\Resources\Clients\Widgets\ClientPlanDistributionChart;
use App\Filament\Resources\Clients\Widgets\ClientStatsOverview;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListClients extends ListRecords
{
    protected static string $resource = ClientResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            ClientStatsOverview::class,
            ClientPlanDistributionChart::class,
        ];
    }
}