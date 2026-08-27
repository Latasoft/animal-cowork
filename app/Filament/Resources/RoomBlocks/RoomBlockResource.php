<?php

namespace App\Filament\Resources\RoomBlocks;

use App\Filament\Resources\RoomBlocks\Pages\CreateRoomBlock;
use App\Filament\Resources\RoomBlocks\Pages\EditRoomBlock;
use App\Filament\Resources\RoomBlocks\Pages\ListRoomBlocks;
use App\Filament\Resources\RoomBlocks\Schemas\RoomBlockForm;
use App\Filament\Resources\RoomBlocks\Tables\RoomBlocksTable;
use App\Models\RoomBlock;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class RoomBlockResource extends Resource
{
    protected static ?string $model = RoomBlock::class;

    protected static string|BackedEnum|null $navigationIcon =
        Heroicon::OutlinedNoSymbol;

    protected static ?string $modelLabel = 'bloqueo';

    protected static ?string $pluralModelLabel = 'bloqueos';

    protected static string|\UnitEnum|null $navigationGroup = 'Reservas de salas';

    protected static ?string $navigationLabel = 'Bloqueos';

    public static function form(Schema $schema): Schema
    {
        return RoomBlockForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return RoomBlocksTable::configure($table);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->with('room');
    }

    public static function getPages(): array
    {
        return [
            'index' => ListRoomBlocks::route('/'),
            'create' => CreateRoomBlock::route('/create'),
            'edit' => EditRoomBlock::route('/{record}/edit'),
        ];
    }
}