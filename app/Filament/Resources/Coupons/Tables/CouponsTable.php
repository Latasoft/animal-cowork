<?php

namespace App\Filament\Resources\Coupons\Tables;

use App\Models\Coupon;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class CouponsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')->label('Código')->searchable()->sortable()->copyable(),
                TextColumn::make('description')->label('Descripción')->searchable()->placeholder('—')->limit(40),
                TextColumn::make('discount_value')->label('Descuento')
                    ->formatStateUsing(fn (Coupon $record): string => $record->label()),
                TextColumn::make('applies_to')->label('Aplica a')
                    ->formatStateUsing(fn (string $state): string => Coupon::APPLIES_TO[$state] ?? $state)
                    ->badge(),
                TextColumn::make('ends_at')->label('Vence')->date('d/m/Y')->placeholder('Sin vencimiento')->sortable(),
                TextColumn::make('used_count')->label('Usos')
                    ->formatStateUsing(fn (Coupon $record): string => $record->used_count.($record->max_uses ? ' / '.$record->max_uses : ''))
                    ->sortable(),
                IconColumn::make('is_active')->label('Activo')->boolean()->sortable(),
            ])
            ->filters([
                TernaryFilter::make('is_active')->label('Activo'),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
