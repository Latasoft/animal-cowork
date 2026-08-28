<?php

namespace App\Filament\Resources\PatentManagementServices\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PatentManagementServiceInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Información principal')
                    ->schema([
                        TextEntry::make('slug')
                            ->label('Slug'),

                        TextEntry::make('eyebrow')
                            ->label('Eyebrow'),

                        TextEntry::make('title')
                            ->label('Título')
                            ->columnSpanFull(),

                        TextEntry::make('description')
                            ->label('Descripción')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Section::make('Imagen')
                    ->schema([
                        ImageEntry::make('image')
                            ->label('Imagen principal')
                            ->disk('public')
                            ->height(250)
                            ->width('100%')
                            ->extraImgAttributes([
                                'class' => 'rounded-xl object-cover',
                            ])
                            ->columnSpanFull(),

                        TextEntry::make('image')
                            ->label('Ruta de la imagen'),

                        TextEntry::make('image_alt')
                            ->label('Texto alternativo'),
                    ])
                    ->columns(2),

                Section::make('Servicio')
                    ->schema([
                        TextEntry::make('service_section_title')
                            ->label('Título'),

                        TextEntry::make('service_section_description')
                            ->label('Descripción')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Section::make('Información legal')
                    ->schema([
                        TextEntry::make('legal_notice')
                            ->label('Aviso legal')
                            ->columnSpanFull(),
                    ]),

                Section::make('Precio')
                    ->schema([
                        TextEntry::make('service_price')
                            ->label('Precio')
                            ->money('CLP'),

                        TextEntry::make('currency')
                            ->label('Moneda'),
                    ])
                    ->columns(2),

                Section::make('Información municipal')
                    ->schema([
                        TextEntry::make('municipal_payment_detail')
                            ->label('Detalle')
                            ->columnSpanFull(),
                    ]),

                Section::make('Aviso comercial')
                    ->schema([
                        TextEntry::make('exclusive_notice')
                            ->label('Aviso')
                            ->columnSpanFull(),
                    ]),

                Section::make('Botón principal')
                    ->schema([
                        TextEntry::make('primary_action_label')
                            ->label('Texto'),

                        TextEntry::make('primary_action_href')
                            ->label('Destino'),
                    ])
                    ->columns(2),

                Section::make('Publicación')
                    ->schema([
                        TextEntry::make('is_active')
                            ->label('Activo')
                            ->badge(),

                        TextEntry::make('sort_order')
                            ->label('Orden'),

                        TextEntry::make('created_at')
                            ->label('Creado')
                            ->dateTime('d/m/Y H:i'),

                        TextEntry::make('updated_at')
                            ->label('Actualizado')
                            ->dateTime('d/m/Y H:i'),
                    ])
                    ->columns(2),
            ]);
    }
}
