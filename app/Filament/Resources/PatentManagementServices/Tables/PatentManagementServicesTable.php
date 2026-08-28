<?php

namespace App\Filament\Resources\PatentManagementServices\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PatentManagementServicesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Servicio')
                    ->searchable()
                    ->sortable()
                    ->limit(60),

                TextColumn::make('service_price')
                    ->label('Precio')
                    ->money('CLP')
                    ->sortable(),

                TextColumn::make('currency')
                    ->label('Moneda')
                    ->badge(),

                IconColumn::make('is_active')
                    ->label('Activo')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('sort_order')
                    ->label('Orden')
                    ->numeric()
                    ->sortable(),

                TextColumn::make('updated_at')
                    ->label('Última actualización')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),

                Action::make('restore')
                    ->label('Restaurar')
                    ->icon('heroicon-o-arrow-path')
                    ->color('success')
                    ->visible(
                        fn ($record): bool =>
                            $record->trashed(),
                    )
                    ->action(
                        fn ($record) => $record->restore(),
                    ),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ])
            ->modifyQueryUsing(
                fn (Builder $query) =>
                    $query->withoutGlobalScopes([
                        SoftDeletingScope::class,
                    ]),
            );
    }
}