<?php

namespace App\Filament\Resources\PatentManagementServices;

use App\Filament\Resources\PatentManagementServices\Pages\CreatePatentManagementService;
use App\Filament\Resources\PatentManagementServices\Pages\EditPatentManagementService;
use App\Filament\Resources\PatentManagementServices\Pages\ListPatentManagementServices;
use App\Filament\Resources\PatentManagementServices\Pages\ViewPatentManagementService;
use App\Filament\Resources\PatentManagementServices\Schemas\PatentManagementServiceForm;
use App\Filament\Resources\PatentManagementServices\Schemas\PatentManagementServiceInfolist;
use App\Filament\Resources\PatentManagementServices\Tables\PatentManagementServicesTable;
use App\Models\PatentManagementService;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PatentManagementServiceResource extends Resource
{
    protected static ?string $model = PatentManagementService::class;

    protected static string|BackedEnum|null $navigationIcon =
        Heroicon::OutlinedDocumentCheck;

    protected static ?string $modelLabel = 'servicio de patente';

    protected static ?string $pluralModelLabel = 'servicios de patente';

    protected static ?string $navigationLabel = 'Gestión de Patente';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return PatentManagementServiceForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return PatentManagementServiceInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PatentManagementServicesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPatentManagementServices::route('/'),
            'create' => CreatePatentManagementService::route('/create'),
            'view' => ViewPatentManagementService::route('/{record}'),
            'edit' => EditPatentManagementService::route('/{record}/edit'),
        ];
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}