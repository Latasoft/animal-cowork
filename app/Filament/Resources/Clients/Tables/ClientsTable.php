<?php

namespace App\Filament\Resources\Clients\Tables;

use App\Models\Plan;
use App\Models\Subscription;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class ClientsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([

                /*
                |--------------------------------------------------------------------------
                | Empresa
                |--------------------------------------------------------------------------
                */

                TextColumn::make('company_name')
                    ->label('Empresa')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                /*
                |--------------------------------------------------------------------------
                | RUT
                |--------------------------------------------------------------------------
                */

                TextColumn::make('company_rut')
                    ->label('RUT')
                    ->searchable()
                    ->copyable(),

                /*
                |--------------------------------------------------------------------------
                | Correo
                |--------------------------------------------------------------------------
                */

                TextColumn::make('email')
                    ->label('Correo')
                    ->searchable()
                    ->toggleable(),

                /*
                |--------------------------------------------------------------------------
                | Plan actual
                |--------------------------------------------------------------------------
                |
                | Se obtiene desde la suscripción con mayor ends_at.
                |
                */

                TextColumn::make('current_plan')
                    ->label('Plan')
                    ->state(function ($record): ?string {
                        return $record->subscriptions
                            ->sortByDesc('ends_at')
                            ->first()
                            ?->plan
                            ?->name;
                    })
                    ->badge()
                    ->color('info')
                    ->placeholder('Sin plan')
                    ->sortable(
                        query: function (
                            Builder $query,
                            string $direction
                        ): Builder {
                            $direction = strtolower($direction) === 'desc'
                                ? 'desc'
                                : 'asc';

                            return $query->orderBy(
                                Plan::query()
                                    ->select('name')
                                    ->join(
                                        'subscriptions',
                                        'subscriptions.plan_id',
                                        '=',
                                        'plans.id'
                                    )
                                    ->whereColumn(
                                        'subscriptions.client_id',
                                        'clients.id'
                                    )
                                    ->orderByDesc('subscriptions.ends_at')
                                    ->limit(1),
                                $direction
                            );
                        }
                    ),

                /*
                |--------------------------------------------------------------------------
                | Estado calculado
                |--------------------------------------------------------------------------
                |
                | El estado NO depende del campo status de Subscription.
                |
                | Activo:
                | más de 30 días.
                |
                | Por vencer:
                | desde hoy hasta 30 días.
                |
                | Vencido:
                | antes de hoy.
                |
                | Sin suscripción:
                | no tiene suscripciones.
                |
                */

                TextColumn::make('calculated_status')
                    ->label('Estado')
                    ->state(function ($record): string {
                        $subscription = $record->subscriptions
                            ->sortByDesc('ends_at')
                            ->first();

                        if (! $subscription) {
                            return 'Sin suscripción';
                        }

                        $today = Carbon::today();
                        $next30Days = $today->copy()->addDays(30);
                        $endsAt = Carbon::parse($subscription->ends_at);

                        if ($endsAt->lt($today)) {
                            return 'Vencido';
                        }

                        if ($endsAt->lte($next30Days)) {
                            return 'Por vencer';
                        }

                        return 'Activo';
                    })
                    ->badge()
                    ->color(function ($state): string {
                        return match ($state) {
                            'Activo' => 'success',
                            'Por vencer' => 'warning',
                            'Vencido' => 'danger',
                            'Sin suscripción' => 'gray',
                            default => 'gray',
                        };
                    })
                    ->sortable(
                        query: function (
                            Builder $query,
                            string $direction
                        ): Builder {
                            $direction = strtolower($direction) === 'desc'
                                ? 'desc'
                                : 'asc';

                            $today = Carbon::today()->toDateString();

                            $next30Days = Carbon::today()
                                ->addDays(30)
                                ->toDateString();

                            $statusOrder = "
                                CASE
                                    WHEN NOT EXISTS (
                                        SELECT 1
                                        FROM subscriptions
                                        WHERE subscriptions.client_id = clients.id
                                    ) THEN 4

                                    WHEN (
                                        SELECT subscriptions.ends_at
                                        FROM subscriptions
                                        WHERE subscriptions.client_id = clients.id
                                        ORDER BY subscriptions.ends_at DESC
                                        LIMIT 1
                                    ) < '{$today}' THEN 3

                                    WHEN (
                                        SELECT subscriptions.ends_at
                                        FROM subscriptions
                                        WHERE subscriptions.client_id = clients.id
                                        ORDER BY subscriptions.ends_at DESC
                                        LIMIT 1
                                    ) <= '{$next30Days}' THEN 2

                                    ELSE 1
                                END
                            ";

                            return $query->orderByRaw(
                                "{$statusOrder} {$direction}"
                            );
                        }
                    ),

                /*
                |--------------------------------------------------------------------------
                | Vencimiento
                |--------------------------------------------------------------------------
                */

                TextColumn::make('subscription_ends_at')
                    ->label('Vencimiento')
                    ->state(function ($record) {
                        return $record->subscriptions
                            ->sortByDesc('ends_at')
                            ->first()
                            ?->ends_at;
                    })
                    ->date('d/m/Y')
                    ->placeholder('—')
                    ->sortable(
                        query: function (
                            Builder $query,
                            string $direction
                        ): Builder {
                            $direction = strtolower($direction) === 'desc'
                                ? 'desc'
                                : 'asc';

                            return $query->orderBy(
                                Subscription::query()
                                    ->select('ends_at')
                                    ->whereColumn(
                                        'subscriptions.client_id',
                                        'clients.id'
                                    )
                                    ->orderByDesc('ends_at')
                                    ->limit(1),
                                $direction
                            );
                        }
                    ),

                /*
                |--------------------------------------------------------------------------
                | Días restantes
                |--------------------------------------------------------------------------
                |
                | Se calcula exclusivamente desde ends_at.
                |
                | Ejemplos:
                |
                | 45 días
                | 12 días
                | Vence hoy
                | Vencido hace 3 días
                |
                */

                TextColumn::make('remaining_days')
                    ->label('Días restantes')
                    ->state(function ($record): string {
                        $subscription = $record->subscriptions
                            ->sortByDesc('ends_at')
                            ->first();

                        if (! $subscription || ! $subscription->ends_at) {
                            return '—';
                        }

                        $today = Carbon::today();
                        $endsAt = Carbon::parse($subscription->ends_at);

                        if ($endsAt->lt($today)) {
                            $days = $endsAt->diffInDays($today);

                            return $days === 1
                                ? 'Vencido hace 1 día'
                                : "Vencido hace {$days} días";
                        }

                        if ($endsAt->isSameDay($today)) {
                            return 'Vence hoy';
                        }

                        $days = $today->diffInDays($endsAt);

                        return $days === 1
                            ? '1 día'
                            : "{$days} días";
                    })
                    ->color(function ($state): string {
                        if ($state === 'Vence hoy') {
                            return 'danger';
                        }

                        if (str_starts_with($state, 'Vencido')) {
                            return 'danger';
                        }

                        if (
                            $state !== '—'
                            && preg_match('/^([0-9]+)/', $state, $matches)
                        ) {
                            $days = (int) $matches[1];

                            if ($days <= 30) {
                                return 'warning';
                            }
                        }

                        return 'success';
                    })
                    ->sortable(
                        query: function (
                            Builder $query,
                            string $direction
                        ): Builder {
                            $direction = strtolower($direction) === 'desc'
                                ? 'desc'
                                : 'asc';

                            return $query->orderBy(
                                Subscription::query()
                                    ->select('ends_at')
                                    ->whereColumn(
                                        'subscriptions.client_id',
                                        'clients.id'
                                    )
                                    ->orderByDesc('ends_at')
                                    ->limit(1),
                                $direction
                            );
                        }
                    ),

                /*
                |--------------------------------------------------------------------------
                | Teléfono
                |--------------------------------------------------------------------------
                */

                TextColumn::make('phone')
                    ->label('Teléfono')
                    ->searchable()
                    ->toggleable(
                        isToggledHiddenByDefault: true
                    ),

                /*
                |--------------------------------------------------------------------------
                | Representante
                |--------------------------------------------------------------------------
                */

                TextColumn::make('representative_name')
                    ->label('Representante')
                    ->searchable()
                    ->toggleable(
                        isToggledHiddenByDefault: true
                    ),

                /*
                |--------------------------------------------------------------------------
                | Comuna
                |--------------------------------------------------------------------------
                */

                TextColumn::make('commune')
                    ->label('Comuna')
                    ->searchable()
                    ->toggleable(
                        isToggledHiddenByDefault: true
                    ),
            ])

            /*
            |--------------------------------------------------------------------------
            | BÚSQUEDA GLOBAL
            |--------------------------------------------------------------------------
            |
            | Filament utiliza searchable() en las columnas anteriores.
            | Además se permite buscar por varios datos del cliente desde
            | el buscador principal de la tabla.
            |
            */

            ->filters([

                /*
                |--------------------------------------------------------------------------
                | Estado
                |--------------------------------------------------------------------------
                */

                SelectFilter::make('status')
                    ->label('Estado')
                    ->options([
                        'active' => 'Activo',
                        'expiring' => 'Por vencer',
                        'expired' => 'Vencido',
                        'without_subscription' => 'Sin suscripción',
                    ])
                    ->query(function (
                        Builder $query,
                        array $data
                    ): Builder {
                        $status = $data['value'] ?? null;

                        if (! $status) {
                            return $query;
                        }

                        $today = Carbon::today();
                        $next30Days = $today->copy()->addDays(30);

                        return match ($status) {

                            /*
                            |--------------------------------------------------------------------------
                            | Activo
                            |--------------------------------------------------------------------------
                            */

                            'active' => $query->whereHas(
                                'subscriptions',
                                function (
                                    Builder $subscriptionQuery
                                ) use (
                                    $next30Days
                                ): void {
                                    $subscriptionQuery
                                        ->where(
                                            'ends_at',
                                            '>',
                                            $next30Days
                                        )
                                        ->whereNotExists(
                                            function ($subQuery) {
                                                $subQuery
                                                    ->selectRaw('1')
                                                    ->from(
                                                        'subscriptions as newer_subscription'
                                                    )
                                                    ->whereColumn(
                                                        'newer_subscription.client_id',
                                                        'subscriptions.client_id'
                                                    )
                                                    ->whereColumn(
                                                        'newer_subscription.ends_at',
                                                        '>',
                                                        'subscriptions.ends_at'
                                                    );
                                            }
                                        );
                                }
                            ),

                            /*
                            |--------------------------------------------------------------------------
                            | Por vencer
                            |--------------------------------------------------------------------------
                            */

                            'expiring' => $query->whereHas(
                                'subscriptions',
                                function (
                                    Builder $subscriptionQuery
                                ) use (
                                    $today,
                                    $next30Days
                                ): void {
                                    $subscriptionQuery
                                        ->whereBetween(
                                            'ends_at',
                                            [
                                                $today,
                                                $next30Days,
                                            ]
                                        )
                                        ->whereNotExists(
                                            function ($subQuery) {
                                                $subQuery
                                                    ->selectRaw('1')
                                                    ->from(
                                                        'subscriptions as newer_subscription'
                                                    )
                                                    ->whereColumn(
                                                        'newer_subscription.client_id',
                                                        'subscriptions.client_id'
                                                    )
                                                    ->whereColumn(
                                                        'newer_subscription.ends_at',
                                                        '>',
                                                        'subscriptions.ends_at'
                                                    );
                                            }
                                        );
                                }
                            ),

                            /*
                            |--------------------------------------------------------------------------
                            | Vencido
                            |--------------------------------------------------------------------------
                            */

                            'expired' => $query->whereHas(
                                'subscriptions',
                                function (
                                    Builder $subscriptionQuery
                                ) use (
                                    $today
                                ): void {
                                    $subscriptionQuery
                                        ->where(
                                            'ends_at',
                                            '<',
                                            $today
                                        )
                                        ->whereNotExists(
                                            function ($subQuery) {
                                                $subQuery
                                                    ->selectRaw('1')
                                                    ->from(
                                                        'subscriptions as newer_subscription'
                                                    )
                                                    ->whereColumn(
                                                        'newer_subscription.client_id',
                                                        'subscriptions.client_id'
                                                    )
                                                    ->whereColumn(
                                                        'newer_subscription.ends_at',
                                                        '>',
                                                        'subscriptions.ends_at'
                                                    );
                                            }
                                        );
                                }
                            ),

                            /*
                            |--------------------------------------------------------------------------
                            | Sin suscripción
                            |--------------------------------------------------------------------------
                            */

                            'without_subscription' => $query
                                ->whereDoesntHave('subscriptions'),

                            default => $query,
                        };
                    }),

                /*
                |--------------------------------------------------------------------------
                | Plan
                |--------------------------------------------------------------------------
                */

                SelectFilter::make('plan')
                    ->label('Plan')
                    ->options(
                        fn (): array => Plan::query()
                            ->orderBy('sort_order')
                            ->orderBy('name')
                            ->pluck('name', 'id')
                            ->toArray()
                    )
                    ->query(function (
                        Builder $query,
                        array $data
                    ): Builder {
                        $planId = $data['value'] ?? null;

                        if (! $planId) {
                            return $query;
                        }

                        return $query->whereHas(
                            'subscriptions',
                            function (
                                Builder $subscriptionQuery
                            ) use (
                                $planId
                            ): void {
                                $subscriptionQuery
                                    ->where(
                                        'plan_id',
                                        $planId
                                    )
                                    ->whereNotExists(
                                        function ($subQuery) {
                                            $subQuery
                                                ->selectRaw('1')
                                                ->from(
                                                    'subscriptions as newer_subscription'
                                                )
                                                ->whereColumn(
                                                    'newer_subscription.client_id',
                                                    'subscriptions.client_id'
                                                )
                                                ->whereColumn(
                                                    'newer_subscription.ends_at',
                                                    '>',
                                                    'subscriptions.ends_at'
                                                );
                                        }
                                    );
                            }
                        );
                    }),

                /*
                |--------------------------------------------------------------------------
                | Eliminados
                |--------------------------------------------------------------------------
                */

                TrashedFilter::make(),
            ])

            /*
            |--------------------------------------------------------------------------
            | Acciones por registro
            |--------------------------------------------------------------------------
            */

            ->recordActions([
                EditAction::make(),
            ])

            /*
            |--------------------------------------------------------------------------
            | Acciones masivas
            |--------------------------------------------------------------------------
            */

            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ])

            /*
            |--------------------------------------------------------------------------
            | Relaciones necesarias para la tabla
            |--------------------------------------------------------------------------
            */

            ->modifyQueryUsing(function (
                Builder $query
            ): Builder {

                /*
                |--------------------------------------------------------------------------
                | Cargar suscripciones y plan
                |--------------------------------------------------------------------------
                */

                $query->with([
                    'subscriptions' => fn ($subscriptionQuery) => $subscriptionQuery
                        ->with('plan')
                        ->orderByDesc('ends_at'),
                ]);

                /*
                |--------------------------------------------------------------------------
                | Filtro proveniente de los widgets
                |--------------------------------------------------------------------------
                |
                | Los widgets utilizan:
                |
                | ?client_status=active
                | ?client_status=expiring
                | ?client_status=expired
                | ?client_status=without_subscription
                |
                */

                $clientStatus = request()->query('client_status');

                if ($clientStatus) {
                    $today = Carbon::today();
                    $next30Days = $today->copy()->addDays(30);

                    $query = match ($clientStatus) {

                        /*
                        |--------------------------------------------------------------------------
                        | Widget: Activos
                        |--------------------------------------------------------------------------
                        */

                        'active' => $query->whereHas(
                            'subscriptions',
                            function (
                                Builder $subscriptionQuery
                            ) use (
                                $next30Days
                            ): void {
                                $subscriptionQuery
                                    ->where(
                                        'ends_at',
                                        '>',
                                        $next30Days
                                    )
                                    ->whereNotExists(
                                        function ($subQuery) {
                                            $subQuery
                                                ->selectRaw('1')
                                                ->from(
                                                    'subscriptions as newer_subscription'
                                                )
                                                ->whereColumn(
                                                    'newer_subscription.client_id',
                                                    'subscriptions.client_id'
                                                )
                                                ->whereColumn(
                                                    'newer_subscription.ends_at',
                                                    '>',
                                                    'subscriptions.ends_at'
                                                );
                                        }
                                    );
                            }
                        ),

                        /*
                        |--------------------------------------------------------------------------
                        | Widget: Por vencer
                        |--------------------------------------------------------------------------
                        */

                        'expiring' => $query->whereHas(
                            'subscriptions',
                            function (
                                Builder $subscriptionQuery
                            ) use (
                                $today,
                                $next30Days
                            ): void {
                                $subscriptionQuery
                                    ->whereBetween(
                                        'ends_at',
                                        [
                                            $today,
                                            $next30Days,
                                        ]
                                    )
                                    ->whereNotExists(
                                        function ($subQuery) {
                                            $subQuery
                                                ->selectRaw('1')
                                                ->from(
                                                    'subscriptions as newer_subscription'
                                                )
                                                ->whereColumn(
                                                    'newer_subscription.client_id',
                                                    'subscriptions.client_id'
                                                )
                                                ->whereColumn(
                                                    'newer_subscription.ends_at',
                                                    '>',
                                                    'subscriptions.ends_at'
                                                );
                                        }
                                    );
                            }
                        ),

                        /*
                        |--------------------------------------------------------------------------
                        | Widget: Vencidos
                        |--------------------------------------------------------------------------
                        */

                        'expired' => $query->whereHas(
                            'subscriptions',
                            function (
                                Builder $subscriptionQuery
                            ) use (
                                $today
                            ): void {
                                $subscriptionQuery
                                    ->where(
                                        'ends_at',
                                        '<',
                                        $today
                                    )
                                    ->whereNotExists(
                                        function ($subQuery) {
                                            $subQuery
                                                ->selectRaw('1')
                                                ->from(
                                                    'subscriptions as newer_subscription'
                                                )
                                                ->whereColumn(
                                                    'newer_subscription.client_id',
                                                    'subscriptions.client_id'
                                                )
                                                ->whereColumn(
                                                    'newer_subscription.ends_at',
                                                    '>',
                                                    'subscriptions.ends_at'
                                                );
                                        }
                                    );
                            }
                        ),

                        /*
                        |--------------------------------------------------------------------------
                        | Widget: Sin suscripción
                        |--------------------------------------------------------------------------
                        */

                        'without_subscription' => $query
                            ->whereDoesntHave('subscriptions'),

                        default => $query,
                    };
                }

                /*
                |--------------------------------------------------------------------------
                | Filtro de plan proveniente de los widgets
                |--------------------------------------------------------------------------
                |
                | Los widgets utilizan:
                |
                | ?client_plan=1
                |
                | ?client_plan=2
                |
                | etc.
                |
                | Solo se considera el plan de la suscripción actual.
                |
                */

                $clientPlan = request()->query('client_plan');

                if ($clientPlan) {
                    $query->whereHas(
                        'subscriptions',
                        function (
                            Builder $subscriptionQuery
                        ) use (
                            $clientPlan
                        ): void {
                            $subscriptionQuery
                                ->where(
                                    'plan_id',
                                    $clientPlan
                                )
                                ->whereNotExists(
                                    function ($subQuery) {
                                        $subQuery
                                            ->selectRaw('1')
                                            ->from(
                                                'subscriptions as newer_subscription'
                                            )
                                            ->whereColumn(
                                                'newer_subscription.client_id',
                                                'subscriptions.client_id'
                                            )
                                            ->whereColumn(
                                                'newer_subscription.ends_at',
                                                '>',
                                                'subscriptions.ends_at'
                                            );
                                    }
                                );
                        }
                    );
                }

                return $query;
            });
    }
}