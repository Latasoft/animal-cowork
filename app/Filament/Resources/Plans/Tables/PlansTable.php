<?php

namespace App\Filament\Resources\Plans\Tables;

use App\Models\Plan;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class PlansTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image_url')->label('Imagen')->square(),
                TextColumn::make('name')->label('Nombre')->searchable()->sortable(),
                TextColumn::make('slug')->label('Slug')->searchable()->copyable(),
                TextColumn::make('badge')->label('Badge')->searchable()->placeholder('—'),
                TextColumn::make('price_office')->label('Oficina')->money('CLP')->sortable(),
                TextColumn::make('price_additional')->label('Adicional')->money('CLP')->sortable(),
                TextColumn::make('total_price')->label('Total')->money('CLP'),
                TextColumn::make('contract_duration_months')->label('Duración')->suffix(' meses')->sortable(),
                IconColumn::make('is_featured')->label('Destacado')->boolean()->sortable(),
                IconColumn::make('is_active')->label('Activo')->boolean()->sortable(),
                TextColumn::make('sort_order')->label('Orden')->numeric()->sortable(),
            ])
            ->filters([
                TernaryFilter::make('is_active')->label('Activo'),
                TernaryFilter::make('is_featured')->label('Destacado'),
                SelectFilter::make('theme')->label('Tema')->options(Plan::THEMES),
                TrashedFilter::make(),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make()
                    ->using(fn (Plan $record): ?bool => $record->forceDelete())
                    ->successNotificationTitle('Plan eliminado definitivamente'),
                ForceDeleteAction::make()
                    ->successNotificationTitle('Plan eliminado definitivamente'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    RestoreBulkAction::make(),
                ]),
            ])
            ->defaultSort('sort_order');
    }
}
