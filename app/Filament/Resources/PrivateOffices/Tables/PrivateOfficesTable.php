<?php

namespace App\Filament\Resources\PrivateOffices\Tables;

use App\Models\PrivateOffice;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PrivateOfficesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                /*
                |--------------------------------------------------------------------------
                | Imagen
                |--------------------------------------------------------------------------
                */

                ImageColumn::make('office_image')
                    ->label('Imagen')
                    ->getStateUsing(
                        fn (PrivateOffice $record): ?string => ! empty($record->image)
                            ? url($record->image)
                            : null
                    )
                    ->square()
                    ->size(56),

                /*
                |--------------------------------------------------------------------------
                | Información
                |--------------------------------------------------------------------------
                */

                TextColumn::make('name')
                    ->label('Oficina')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('area_m2')
                    ->label('Superficie')
                    ->formatStateUsing(
                        fn ($state): string => number_format(
                            (float) $state,
                            2,
                            ',',
                            '.'
                        ) . ' m²'
                    )
                    ->sortable(),

                /*
                |--------------------------------------------------------------------------
                | Precio
                |--------------------------------------------------------------------------
                */

                TextColumn::make('price')
                    ->label('Precio')
                    ->formatStateUsing(
                        fn ($state, $record): string => $state === null
                            ? 'Consultar'
                            : (
                                $record->currency === 'UF'
                                    ? number_format(
                                        (float) $state,
                                        2,
                                        ',',
                                        '.'
                                    ) . ' UF'
                                    : '$' . number_format(
                                        (float) $state,
                                        0,
                                        ',',
                                        '.'
                                    )
                            )
                    )
                    ->sortable(),

                TextColumn::make('currency')
                    ->label('Moneda')
                    ->badge()
                    ->sortable(),

                /*
                |--------------------------------------------------------------------------
                | Estado
                |--------------------------------------------------------------------------
                */

                IconColumn::make('is_available')
                    ->label('Disponible')
                    ->boolean()
                    ->sortable(),

                IconColumn::make('expenses_included')
                    ->label('Gastos incluidos')
                    ->boolean()
                    ->sortable(),

                IconColumn::make('is_visible')
                    ->label('Visible')
                    ->boolean()
                    ->sortable(),

                /*
                |--------------------------------------------------------------------------
                | Orden
                |--------------------------------------------------------------------------
                */

                TextColumn::make('sort_order')
                    ->label('Orden')
                    ->sortable(),
            ])
            ->defaultSort('sort_order')
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}