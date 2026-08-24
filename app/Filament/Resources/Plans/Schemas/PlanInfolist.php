<?php

namespace App\Filament\Resources\Plans\Schemas;

use App\Models\Plan;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PlanInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Plan')
                    ->columnSpanFull()
                    ->schema([
                        ImageEntry::make('image_url')
                            ->label('Imagen')
                            ->imageHeight(120),
                        TextEntry::make('name')->label('Nombre'),
                        TextEntry::make('slug')->label('Slug')->copyable(),
                        TextEntry::make('badge')->label('Badge')->placeholder('Sin badge'),
                        TextEntry::make('theme')
                            ->label('Tema')
                            ->formatStateUsing(fn (string $state): string => Plan::THEMES[$state] ?? $state),
                    ])
                    ->columns(3),
                Section::make('Contrato y precios')
                    ->columnSpanFull()
                    ->schema([
                        TextEntry::make('price_office')->label('Precio oficina')->money('CLP'),
                        TextEntry::make('price_additional')->label('Precio adicional')->money('CLP'),
                        TextEntry::make('total_price')->label('Precio total')->money('CLP'),
                        TextEntry::make('contract_duration_months')->label('Duración')->suffix(' meses'),
                        TextEntry::make('features')
                            ->label('Características')
                            ->bulleted()
                            ->columnSpanFull(),
                    ])
                    ->columns(4),
                Section::make('Estado y sala')
                    ->columnSpanFull()
                    ->schema([
                        IconEntry::make('is_active')->label('Activo')->boolean(),
                        IconEntry::make('is_featured')->label('Destacado')->boolean(),
                        IconEntry::make('includes_room_access')->label('Incluye sala')->boolean(),
                        TextEntry::make('monthly_room_minutes_included')->label('Minutos mensuales'),
                        IconEntry::make('room_minutes_rollover')->label('Acumulables')->boolean(),
                        TextEntry::make('extra_room_hour_price_net')->label('Hora adicional neta')->money('CLP')->placeholder('No aplica'),
                        IconEntry::make('extra_room_hour_taxable')->label('Afecta a IVA')->boolean(),
                        TextEntry::make('sort_order')->label('Orden'),
                        TextEntry::make('deletion_status')
                            ->label('Eliminación')
                            ->state(fn (Plan $record): string => $record->subscriptions()->exists()
                                ? 'Tiene contratos asociados: desactívalo en lugar de eliminarlo.'
                                : 'Se puede eliminar de forma segura.'),
                    ])
                    ->columns(4),
            ]);
    }
}
