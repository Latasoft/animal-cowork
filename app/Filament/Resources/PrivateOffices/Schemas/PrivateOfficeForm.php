<?php

namespace App\Filament\Resources\PrivateOffices\Schemas;

use App\Models\PrivateOffice;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\ViewField;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PrivateOfficeForm
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

                Section::make('Información de la oficina')
                    ->description(
                        'Información principal que se mostrará en la card de la oficina privada.'
                    )
                    ->schema([
                        TextInput::make('name')
                            ->label('Nombre')
                            ->placeholder('Oficina 4')
                            ->required()
                            ->maxLength(255),

                        TextInput::make('slug')
                            ->label('Slug')
                            ->placeholder('oficina-4')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),

                        TextInput::make('area_m2')
                            ->label('Superficie')
                            ->numeric()
                            ->minValue(0)
                            ->step(0.01)
                            ->suffix('m²')
                            ->required(),

                        TextInput::make('image_alt')
                            ->label('Texto alternativo de la imagen')
                            ->placeholder(
                                'Interior de la Oficina 4 de Animal Co-work'
                            )
                            ->maxLength(255)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | Imagen
                |--------------------------------------------------------------------------
                */

                Section::make('Imagen de la oficina')
                    ->description(
                        'Visualiza la imagen actual y, si lo necesitas, carga una nueva para reemplazarla.'
                    )
                    ->schema([
                        ViewField::make('current_image')
                            ->label('Imagen actual')
                            ->view('filament.private-offices.current-image')
                            ->viewData(
                                fn (?PrivateOffice $record): array => [
                                    'image' => $record?->image,
                                ]
                            )
                            ->columnSpanFull(),

                        FileUpload::make('new_image')
                            ->label('Nueva imagen')
                            ->disk('public')
                            ->directory('private-offices')
                            ->visibility('public')
                            ->image()
                            ->imagePreviewHeight('240')
                            ->openable()
                            ->downloadable()
                            ->maxSize(5120)
                            ->helperText(
                                'Selecciona una imagen solo si deseas reemplazar la actual. Formatos recomendados: JPG, JPEG, PNG o WEBP. Máximo 5 MB.'
                            )
                            ->columnSpanFull(),
                    ]),

                /*
                |--------------------------------------------------------------------------
                | Características
                |--------------------------------------------------------------------------
                */

                Section::make('Características')
                    ->description(
                        'Características y servicios incluidos en esta oficina.'
                    )
                    ->schema([
                        Repeater::make('features')
                            ->label('Características')
                            ->simple(
                                TextInput::make('feature')
                                    ->hiddenLabel()
                                    ->placeholder('Ej. Wifi')
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
                        'Define el precio, moneda y condiciones comerciales de la oficina.'
                    )
                    ->schema([
                        TextInput::make('price')
                            ->label('Precio de arriendo')
                            ->numeric()
                            ->prefix('$')
                            ->minValue(0)
                            ->nullable()
                            ->helperText(
                                'Deja vacío si el precio debe consultarse.'
                            ),

                        Select::make('currency')
                            ->label('Moneda')
                            ->options([
                                'CLP' => 'Pesos chilenos (CLP)',
                                'UF' => 'UF',
                            ])
                            ->default('CLP')
                            ->required(),

                        Toggle::make('expenses_included')
                            ->label('Gastos incluidos')
                            ->helperText(
                                'Indica si los gastos comunes están incluidos en el precio.'
                            )
                            ->default(true),

                        Toggle::make('is_available')
                            ->label('Disponible')
                            ->helperText(
                                'Indica si actualmente existe disponibilidad para esta oficina.'
                            )
                            ->default(false),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | Publicación
                |--------------------------------------------------------------------------
                */

                Section::make('Publicación')
                    ->description(
                        'Controla el orden y la visibilidad de esta oficina en la página pública.'
                    )
                    ->schema([
                        Toggle::make('is_visible')
                            ->label('Mostrar en la página')
                            ->helperText(
                                'Si está desactivada, la oficina permanecerá en la base de datos pero no aparecerá públicamente.'
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
            ]);
    }
}
