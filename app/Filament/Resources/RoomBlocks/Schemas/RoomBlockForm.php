<?php

namespace App\Filament\Resources\RoomBlocks\Schemas;

use App\Models\Room;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RoomBlockForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Bloqueo de disponibilidad')
                    ->description(
                        'Define una sala y el período durante el cual no estará disponible para reservas.'
                    )
                    ->schema([
                        Select::make('room_id')
                            ->label('Sala')
                            ->options(
                                fn (): array => Room::query()
                                    ->orderBy('sort_order')
                                    ->pluck('name', 'id')
                                    ->toArray()
                            )
                            ->searchable()
                            ->preload()
                            ->required(),

                        Toggle::make('is_active')
                            ->label('Bloqueo activo')
                            ->default(true)
                            ->helperText(
                                'Si se desactiva, la sala volverá a estar disponible.'
                            ),

                        DateTimePicker::make('starts_at')
                            ->label('Inicio del bloqueo')
                            ->seconds(false)
                            ->displayFormat('d/m/Y H:i')
                            ->native(false)
                            ->required(),

                        DateTimePicker::make('ends_at')
                            ->label('Fin del bloqueo')
                            ->seconds(false)
                            ->displayFormat('d/m/Y H:i')
                            ->native(false)
                            ->required()
                            ->after('starts_at'),

                        Textarea::make('reason')
                            ->label('Motivo')
                            ->placeholder(
                                'Ej: Mantención, evento interno, feriado...'
                            )
                            ->rows(3)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }
}