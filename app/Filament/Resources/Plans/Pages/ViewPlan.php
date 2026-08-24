<?php

namespace App\Filament\Resources\Plans\Pages;

use App\Filament\Resources\Plans\PlanResource;
use App\Models\Plan;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Resources\Pages\ViewRecord;

class ViewPlan extends ViewRecord
{
    protected static string $resource = PlanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
            DeleteAction::make()
                ->using(fn (Plan $record): ?bool => $record->forceDelete())
                ->successNotificationTitle('Plan eliminado definitivamente'),
            ForceDeleteAction::make()
                ->successNotificationTitle('Plan eliminado definitivamente'),
        ];
    }
}
