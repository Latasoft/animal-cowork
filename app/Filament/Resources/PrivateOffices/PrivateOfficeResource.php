<?php

namespace App\Filament\Resources\PrivateOffices;

use App\Filament\Resources\PrivateOffices\Pages\CreatePrivateOffice;
use App\Filament\Resources\PrivateOffices\Pages\EditPrivateOffice;
use App\Filament\Resources\PrivateOffices\Pages\ListPrivateOffices;
use App\Filament\Resources\PrivateOffices\Schemas\PrivateOfficeForm;
use App\Filament\Resources\PrivateOffices\Tables\PrivateOfficesTable;
use App\Models\PrivateOffice;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PrivateOfficeResource extends Resource
{
    protected static ?string $model = PrivateOffice::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingOffice2;

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?string $navigationLabel = 'Oficinas privadas';

    protected static ?string $modelLabel = 'Oficina privada';

    protected static ?string $pluralModelLabel = 'Oficinas privadas';

    public static function form(Schema $schema): Schema
    {
        return PrivateOfficeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PrivateOfficesTable::configure($table);
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
            'index' => ListPrivateOffices::route('/'),
            'create' => CreatePrivateOffice::route('/create'),
            'edit' => EditPrivateOffice::route('/{record}/edit'),
        ];
    }
}