<?php

namespace App\Filament\Resources\Clients\Schemas;

use App\Models\Plan;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ClientForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                /*
                |--------------------------------------------------------------------------
                | Información de la empresa
                |--------------------------------------------------------------------------
                */

                Section::make('Información de la empresa')
                    ->schema([
                        TextInput::make('company_name')
                            ->label('Nombre de la empresa')
                            ->required()
                            ->maxLength(255),

                        TextInput::make('company_rut')
                            ->label('RUT empresa')
                            ->required()
                            ->maxLength(20),

                        Select::make('contract_type')
                            ->label('Tipo de contrato')
                            ->options([
                                'persona_juridica' => 'Persona jurídica',
                                'persona_natural' => 'Persona natural',
                            ])
                            ->required()
                            ->native(false),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | Información de contacto
                |--------------------------------------------------------------------------
                */

                Section::make('Información de contacto')
                    ->schema([
                        TextInput::make('email')
                            ->label('Correo electrónico')
                            ->email()
                            ->required()
                            ->maxLength(255),

                        TextInput::make('phone')
                            ->label('Teléfono')
                            ->tel()
                            ->maxLength(50),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | Representante
                |--------------------------------------------------------------------------
                */

                Section::make('Representante')
                    ->schema([
                        TextInput::make('representative_name')
                            ->label('Nombre representante')
                            ->maxLength(255),

                        TextInput::make('representative_rut')
                            ->label('RUT representante')
                            ->maxLength(20),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | Dirección
                |--------------------------------------------------------------------------
                */

                Section::make('Dirección')
                    ->schema([
                        TextInput::make('address')
                            ->label('Dirección')
                            ->maxLength(255),

                        TextInput::make('commune')
                            ->label('Comuna')
                            ->maxLength(100),

                        TextInput::make('region')
                            ->label('Región')
                            ->maxLength(100),
                    ])
                    ->columns(3),

                /*
                |--------------------------------------------------------------------------
                | Suscripción
                |--------------------------------------------------------------------------
                */

                Section::make('Suscripción')
                    ->description(
                        'Selecciona el plan. Los precios se cargarán automáticamente y podrás modificarlos si es necesario.'
                    )
                    ->schema([

                        Select::make('subscription_plan_id')
                            ->label('Plan')
                            ->options(
                                fn (): array => Plan::query()
                                    ->orderBy('sort_order')
                                    ->orderBy('name')
                                    ->pluck('name', 'id')
                                    ->toArray()
                            )
                            ->searchable()
                            ->preload()
                            ->required()
                            ->native(false)

                            /*
                            |--------------------------------------------------------------------------
                            | Cargar precios automáticamente
                            |--------------------------------------------------------------------------
                            */

                            ->live()
                            ->afterStateUpdated(function (
                                $state,
                                callable $set
                            ): void {
                                if (! $state) {
                                    $set(
                                        'subscription_price_office',
                                        null
                                    );

                                    $set(
                                        'subscription_price_additional',
                                        0
                                    );

                                    return;
                                }

                                $plan = Plan::find($state);

                                if (! $plan) {
                                    return;
                                }

                                $set(
                                    'subscription_price_office',
                                    $plan->price_office
                                );

                                $set(
                                    'subscription_price_additional',
                                    $plan->price_additional
                                );
                            }),

                        DatePicker::make('subscription_starts_at')
                            ->label('Fecha de inicio')
                            ->default(now())
                            ->required()
                            ->native(false)
                            ->displayFormat('d/m/Y'),

                        DatePicker::make('subscription_ends_at')
                            ->label('Fecha de vencimiento')
                            ->required()
                            ->native(false)
                            ->displayFormat('d/m/Y'),

                        TextInput::make('subscription_price_office')
                            ->label('Precio oficina')
                            ->numeric()
                            ->prefix('$')
                            ->required(),

                        TextInput::make('subscription_price_additional')
                            ->label('Precio adicional')
                            ->numeric()
                            ->prefix('$')
                            ->default(0)
                            ->required(),

                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | Información administrativa
                |--------------------------------------------------------------------------
                */

                Section::make('Información administrativa')
                    ->schema([
                        Textarea::make('notes')
                            ->label('Notas')
                            ->rows(4)
                            ->maxLength(5000)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}