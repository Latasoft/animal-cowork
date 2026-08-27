<?php

namespace App\Filament\Resources\Rooms\Schemas;

use App\Models\Room;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\ViewField;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RoomForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                /*
                |--------------------------------------------------------------------------
                | Información general
                |--------------------------------------------------------------------------
                */

                Section::make('Información de la sala')
                    ->description('Información pública que se mostrará a los clientes.')
                    ->schema([
                        TextInput::make('name')
                            ->label('Nombre')
                            ->placeholder('Sala de Reuniones 1')
                            ->required()
                            ->maxLength(255),

                        TextInput::make('short_name')
                            ->label('Nombre corto')
                            ->placeholder('Sala 1')
                            ->required()
                            ->maxLength(100),

                        TextInput::make('slug')
                            ->label('Slug')
                            ->placeholder('sala-1')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),

                        TextInput::make('capacity')
                            ->label('Capacidad')
                            ->numeric()
                            ->minValue(1)
                            ->required(),

                        TextInput::make('location')
                            ->label('Ubicación')
                            ->placeholder('Animal Co-work')
                            ->maxLength(255),

                        Textarea::make('description')
                            ->label('Descripción')
                            ->rows(4)
                            ->columnSpanFull(),

                        TextInput::make('image_alt')
                            ->label('Texto alternativo de imágenes')
                            ->placeholder('Sala de reuniones de Animal Coworking')
                            ->maxLength(255)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | Imágenes
                |--------------------------------------------------------------------------
                */

                Section::make('Imágenes')
                    ->description(
                        'Administra las imágenes actuales y agrega nuevas imágenes a la sala.'
                    )
                    ->schema([
                        ViewField::make('current_images')
                            ->label('Imágenes actuales')
                            ->view('filament.rooms.current-images')
                            ->viewData(
                                fn (?Room $record): array => [
                                    'images' => $record?->images ?? [],
                                ]
                            )
                            ->columnSpanFull(),

FileUpload::make('test_image')
    ->disk('public')
    ->directory('test')
    ->image()
                    ]),

                /*
                |--------------------------------------------------------------------------
                | Características
                |--------------------------------------------------------------------------
                */

                Section::make('Características')
                    ->description('Elementos y servicios disponibles en la sala.')
                    ->schema([
                        Repeater::make('features')
                            ->label('Características')
                            ->simple(
                                TextInput::make('feature')
                                    ->hiddenLabel()
                                    ->placeholder('Ej. Aire acondicionado')
                                    ->required()
                                    ->maxLength(100),
                            )
                            ->addActionLabel('Agregar característica')
                            ->reorderable()
                            ->defaultItems(0)
                            ->columnSpanFull(),
                    ]),

                /*
                |--------------------------------------------------------------------------
                | Configuración comercial
                |--------------------------------------------------------------------------
                */

                Section::make('Configuración comercial')
                    ->description(
                        'Define la tarifa normal y el estado de disponibilidad de la sala.'
                    )
                    ->schema([
                        TextInput::make('normal_hour_price_net')
                            ->label('Tarifa normal por hora')
                            ->numeric()
                            ->prefix('$')
                            ->suffix('CLP')
                            ->minValue(0)
                            ->required(),

                        Toggle::make('is_active')
                            ->label('Sala activa')
                            ->helperText(
                                'Si está desactivada, no podrá ser reservada.'
                            )
                            ->default(true),

                        TextInput::make('sort_order')
                            ->label('Orden')
                            ->numeric()
                            ->minValue(0)
                            ->default(0)
                            ->required(),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | Horarios
                |--------------------------------------------------------------------------
                */

                Section::make('Horarios disponibles')
                    ->description(
                        'Define los bloques horarios que los clientes podrán reservar.'
                    )
                    ->schema([
                        Repeater::make('time_slots')
                            ->label('Bloques horarios')
                            ->schema([
                                TextInput::make('id')
                                    ->label('Identificador')
                                    ->placeholder('10-11')
                                    ->required()
                                    ->maxLength(50),

                                TextInput::make('start')
                                    ->label('Inicio')
                                    ->placeholder('10:00')
                                    ->required()
                                    ->maxLength(5),

                                TextInput::make('end')
                                    ->label('Fin operacional')
                                    ->placeholder('11:10')
                                    ->required()
                                    ->maxLength(5),

                                TextInput::make('billable_minutes')
                                    ->label('Minutos cobrables')
                                    ->numeric()
                                    ->minValue(1)
                                    ->default(60)
                                    ->required(),
                            ])
                            ->columns(4)
                            ->addActionLabel('Agregar horario')
                            ->reorderable()
                            ->collapsible()
                            ->itemLabel(
                                fn (array $state): ?string =>
                                    isset($state['id'])
                                        ? $state['id']
                                        : (
                                            isset($state['start'], $state['end'])
                                                ? "{$state['start']} - {$state['end']}"
                                                : null
                                        )
                            )
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}