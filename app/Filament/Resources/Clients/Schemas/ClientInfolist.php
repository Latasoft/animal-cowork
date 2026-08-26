<?php

namespace App\Filament\Resources\Clients\Schemas;

use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Carbon;

class ClientInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                /*
                |--------------------------------------------------------------------------
                | Información del cliente
                |--------------------------------------------------------------------------
                */
                Section::make('Información del cliente')
                    ->schema([
                        TextEntry::make('company_name')
                            ->label('Empresa')
                            ->weight('bold'),

                        TextEntry::make('company_rut')
                            ->label('RUT'),

                        TextEntry::make('email')
                            ->label('Correo')
                            ->copyable(),

                        TextEntry::make('phone')
                            ->label('Teléfono'),

                        TextEntry::make('representative_name')
                            ->label('Representante'),

                        TextEntry::make('representative_rut')
                            ->label('RUT representante'),

                        TextEntry::make('address')
                            ->label('Dirección'),

                        TextEntry::make('commune')
                            ->label('Comuna'),

                        TextEntry::make('region')
                            ->label('Región'),

                        TextEntry::make('contract_type')
                            ->label('Tipo de contrato'),

                        TextEntry::make('notes')
                            ->label('Notas')
                            ->placeholder('Sin notas')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | Suscripción actual
                |--------------------------------------------------------------------------
                */
                Section::make('Suscripción actual')
                    ->schema([
                        TextEntry::make('subscription_plan')
                            ->label('Plan')
                            ->state(function ($record) {
                                return $record->subscriptions
                                    ->sortByDesc('ends_at')
                                    ->first()?->plan?->name
                                    ?? 'Sin suscripción';
                            })
                            ->badge()
                            ->color('info'),

                        TextEntry::make('subscription_status')
                            ->label('Estado')
                            ->state(function ($record) {
                                $subscription = $record->subscriptions
                                    ->sortByDesc('ends_at')
                                    ->first();

                                if (! $subscription) {
                                    return 'Sin suscripción';
                                }

                                $today = Carbon::today();
                                $endsAt = Carbon::parse($subscription->ends_at);

                                if ($endsAt->lt($today)) {
                                    return 'Vencido';
                                }

                                if ($endsAt->lte($today->copy()->addDays(30))) {
                                    return 'Por vencer';
                                }

                                return 'Activo';
                            })
                            ->badge()
                            ->color(function ($state) {
                                return match ($state) {
                                    'Activo' => 'success',
                                    'Por vencer' => 'warning',
                                    'Vencido' => 'danger',
                                    'Sin suscripción' => 'gray',
                                    default => 'gray',
                                };
                            }),

                        TextEntry::make('subscription_starts_at')
                            ->label('Fecha de inicio')
                            ->state(function ($record) {
                                return $record->subscriptions
                                    ->sortByDesc('ends_at')
                                    ->first()?->starts_at;
                            })
                            ->date('d/m/Y')
                            ->placeholder('—'),

                        TextEntry::make('subscription_ends_at')
                            ->label('Fecha de vencimiento')
                            ->state(function ($record) {
                                return $record->subscriptions
                                    ->sortByDesc('ends_at')
                                    ->first()?->ends_at;
                            })
                            ->date('d/m/Y')
                            ->placeholder('—'),

                        TextEntry::make('subscription_remaining')
                            ->label('Vigencia')
                            ->state(function ($record) {
                                $subscription = $record->subscriptions
                                    ->sortByDesc('ends_at')
                                    ->first();

                                if (! $subscription) {
                                    return '—';
                                }

                                $today = Carbon::today();
                                $endsAt = Carbon::parse($subscription->ends_at);

                                if ($endsAt->lt($today)) {
                                    $days = $endsAt->diffInDays($today);

                                    return $days === 1
                                        ? 'Venció hace 1 día'
                                        : "Venció hace {$days} días";
                                }

                                if ($endsAt->isSameDay($today)) {
                                    return 'Vence hoy';
                                }

                                $days = $today->diffInDays($endsAt);

                                return $days === 1
                                    ? 'Vence mañana'
                                    : "Vence en {$days} días";
                            }),

                        TextEntry::make('subscription_price_office')
                            ->label('Precio oficina')
                            ->state(function ($record) {
                                return $record->subscriptions
                                    ->sortByDesc('ends_at')
                                    ->first()?->price_office;
                            })
                            ->money('CLP', locale: 'es_CL')
                            ->placeholder('—'),

                        TextEntry::make('subscription_price_additional')
                            ->label('Precio adicional')
                            ->state(function ($record) {
                                return $record->subscriptions
                                    ->sortByDesc('ends_at')
                                    ->first()?->price_additional;
                            })
                            ->money('CLP', locale: 'es_CL')
                            ->placeholder('—'),

                        TextEntry::make('subscription_total')
                            ->label('Total contratado')
                            ->state(function ($record) {
                                $subscription = $record->subscriptions
                                    ->sortByDesc('ends_at')
                                    ->first();

                                if (! $subscription) {
                                    return null;
                                }

                                return $subscription->price_office
                                    + $subscription->price_additional;
                            })
                            ->money('CLP', locale: 'es_CL')
                            ->weight('bold')
                            ->placeholder('—'),
                    ])
                    ->columns(2),

                /*
                |--------------------------------------------------------------------------
                | Historial de suscripciones
                |--------------------------------------------------------------------------
                */
                Section::make('Historial de suscripciones')
                    ->schema([
                        RepeatableEntry::make('subscription_history')
                            ->label('')
                            ->schema([
                                TextEntry::make('plan.name')
                                    ->label('Plan')
                                    ->badge()
                                    ->color('info')
                                    ->placeholder('Sin plan'),

                                TextEntry::make('starts_at')
                                    ->label('Inicio')
                                    ->date('d/m/Y'),

                                TextEntry::make('ends_at')
                                    ->label('Vencimiento')
                                    ->date('d/m/Y'),

                                TextEntry::make('total_price')
                                    ->label('Total contratado')
                                    ->state(function ($record) {
                                        return $record->price_office
                                            + $record->price_additional;
                                    })
                                    ->money('CLP', locale: 'es_CL')
                                    ->weight('bold'),

                                TextEntry::make('status')
                                    ->label('Estado')
                                    ->state(function ($record) {
                                        $today = Carbon::today();
                                        $endsAt = Carbon::parse($record->ends_at);

                                        if ($endsAt->lt($today)) {
                                            return 'Vencida';
                                        }

                                        if ($endsAt->lte($today->copy()->addDays(30))) {
                                            return 'Por vencer';
                                        }

                                        return 'Activa';
                                    })
                                    ->badge()
                                    ->color(function ($state) {
                                        return match ($state) {
                                            'Activa' => 'success',
                                            'Por vencer' => 'warning',
                                            'Vencida' => 'danger',
                                            default => 'gray',
                                        };
                                    }),
                            ])
                            ->columns(2)
                            ->contained(true)
                            ->state(function ($record) {
                                $subscriptions = $record->subscriptions
                                    ->sortByDesc('ends_at')
                                    ->values();

                                /*
                                |--------------------------------------------------------------------------
                                | Excluir la suscripción actual
                                |--------------------------------------------------------------------------
                                |
                                | La suscripción con la fecha de vencimiento más
                                | reciente es considerada la actual.
                                |
                                */
                                $currentSubscription = $subscriptions->first();

                                if (! $currentSubscription) {
                                    return [];
                                }

                                return $subscriptions
                                    ->filter(
                                        fn ($subscription) =>
                                            $subscription->id !== $currentSubscription->id
                                    )
                                    ->values();
                            })
                            ->placeholder('No hay historial de suscripciones'),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}