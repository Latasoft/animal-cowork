<?php

namespace App\Filament\Resources\CompanyFormationServices;

use App\Filament\Resources\CompanyFormationServices\Pages\CreateCompanyFormationService;
use App\Filament\Resources\CompanyFormationServices\Pages\EditCompanyFormationService;
use App\Filament\Resources\CompanyFormationServices\Pages\ListCompanyFormationServices;
use App\Filament\Resources\CompanyFormationServices\Schemas\CompanyFormationServiceForm;
use App\Filament\Resources\CompanyFormationServices\Tables\CompanyFormationServicesTable;
use App\Models\CompanyFormationService;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CompanyFormationServiceResource extends Resource
{
    protected static ?string $model = CompanyFormationService::class;

    protected static string|BackedEnum|null $navigationIcon =
        Heroicon::OutlinedBuildingOffice2;

    protected static ?string $modelLabel = 'servicio de constitución';

    protected static ?string $pluralModelLabel = 'servicios de constitución';

    protected static ?string $navigationLabel = 'Constitución de Empresa';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return CompanyFormationServiceForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CompanyFormationServicesTable::configure($table);
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
            'index' => ListCompanyFormationServices::route('/'),
            'create' => CreateCompanyFormationService::route('/create'),
            'edit' => EditCompanyFormationService::route('/{record}/edit'),
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