<?php

namespace App\Filament\Resources\Coupons\Schemas;

use App\Models\Coupon;
use App\Models\Plan;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class CouponForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Cupón')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('code')
                            ->label('Código')
                            ->required()
                            ->maxLength(30)
                            ->regex('/^[A-Za-z0-9_-]+$/')
                            ->unique(ignoreRecord: true)
                            ->dehydrateStateUsing(fn (?string $state): string => Coupon::normalizeCode($state))
                            ->helperText('Es lo que escribe el cliente al pagar. Solo letras, números, guion y guion bajo; se guarda en mayúsculas. Ejemplo: PRIMAVERA10.'),
                        TextInput::make('description')
                            ->label('Descripción interna')
                            ->maxLength(255)
                            ->helperText('Opcional. Por ejemplo: "Campaña de primavera" o "Descuento cliente Pérez".'),
                        Toggle::make('is_active')
                            ->label('Activo')
                            ->default(true)
                            ->helperText('Si lo desactivas, el cupón deja de funcionar de inmediato.'),
                    ])
                    ->columns(2),

                Section::make('Descuento')
                    ->columnSpanFull()
                    ->schema([
                        Select::make('discount_type')
                            ->label('Tipo de descuento')
                            ->options(Coupon::TYPES)
                            ->default(Coupon::TYPE_PERCENT)
                            ->required()
                            ->live()
                            ->native(false),
                        TextInput::make('discount_value')
                            ->label('Valor')
                            ->numeric()
                            ->integer()
                            ->required()
                            ->minValue(1)
                            ->maxValue(fn (Get $get): ?int => $get('discount_type') === Coupon::TYPE_PERCENT ? 99 : null)
                            ->prefix(fn (Get $get): ?string => $get('discount_type') === Coupon::TYPE_FIXED ? '$' : null)
                            ->suffix(fn (Get $get): ?string => $get('discount_type') === Coupon::TYPE_PERCENT ? '%' : null)
                            ->helperText('Porcentaje entre 1 y 99, o monto en pesos.'),
                    ])
                    ->columns(2),

                Section::make('Dónde aplica')
                    ->columnSpanFull()
                    ->schema([
                        Select::make('applies_to')
                            ->label('Aplica a')
                            ->options(Coupon::APPLIES_TO)
                            ->default('both')
                            ->required()
                            ->native(false),
                        Select::make('plan_ids')
                            ->label('Planes')
                            ->multiple()
                            ->options(fn (): array => Plan::query()->orderBy('sort_order')->orderBy('name')->pluck('name', 'id')->all())
                            ->native(false)
                            ->helperText('Déjalo vacío para que aplique a todos los planes.'),
                    ])
                    ->columns(2),

                Section::make('Vigencia y usos')
                    ->columnSpanFull()
                    ->schema([
                        DatePicker::make('starts_at')
                            ->label('Válido desde')
                            ->native(false)
                            ->displayFormat('d/m/Y')
                            ->helperText('Opcional.'),
                        DatePicker::make('ends_at')
                            ->label('Válido hasta (inclusive)')
                            ->native(false)
                            ->displayFormat('d/m/Y')
                            ->afterOrEqual('starts_at')
                            ->helperText('Opcional. Si lo dejas vacío, no vence.'),
                        TextInput::make('max_uses')
                            ->label('Máximo de usos')
                            ->numeric()
                            ->integer()
                            ->minValue(1)
                            ->helperText('Opcional. Por ejemplo, 1 para un descuento a un solo cliente. Vacío = sin límite.'),
                        Placeholder::make('used_count_info')
                            ->label('Veces usado')
                            ->content(fn (?Coupon $record): string => (string) ($record?->used_count ?? 0))
                            ->helperText('Se cuenta solo cuando el pago queda aprobado.'),
                    ])
                    ->columns(2),
            ]);
    }
}
