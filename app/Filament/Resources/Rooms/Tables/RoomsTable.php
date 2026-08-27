<?php

namespace App\Filament\Resources\Rooms\Tables;

use App\Models\Room;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class RoomsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                
                ImageColumn::make('room_image')
                    ->label('Imagen')
                    ->getStateUsing(
                        fn (Room $record): ?string => ! empty($record->images[0])
                            ? url($record->images[0])
                            : null
                    )
                    ->square()
                    ->size(56),

                TextColumn::make('name')
                    ->label('Sala')
                    ->searchable()
                    ->sortable()
                    ->description(
                        fn (Room $record): string => $record->slug
                    ),

                TextColumn::make('capacity')
                    ->label('Capacidad')
                    ->formatStateUsing(
                        fn ($state): string => "{$state} personas"
                    )
                    ->sortable(),

                TextColumn::make('normal_hour_price_net')
                    ->label('Tarifa')
                    ->money('CLP')
                    ->sortable(),

                TextColumn::make('is_active')
                    ->label('Estado')
                    ->badge()
                    ->formatStateUsing(
                        fn (bool $state): string => $state
                            ? 'Activa'
                            : 'Inactiva'
                    )
                    ->color(
                        fn (bool $state): string => $state
                            ? 'success'
                            : 'danger'
                    ),
            ])
            ->defaultSort('sort_order')
            ->recordActions([
                EditAction::make(),
            ]);
    }
}