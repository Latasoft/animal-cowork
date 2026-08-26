<?php

namespace App\Filament\Resources\Clients\Widgets;

use App\Filament\Resources\Clients\ClientResource;
use App\Models\Client;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class ClientStatsOverview extends StatsOverviewWidget
{
    protected ?string $pollingInterval = null;

    protected function getStats(): array
    {
        $today = Carbon::today();
        $next30Days = $today->copy()->addDays(30);

        /*
        |--------------------------------------------------------------------------
        | Clientes y suscripciones
        |--------------------------------------------------------------------------
        */

        $clients = Client::query()
            ->with([
                'subscriptions' => fn ($query) => $query
                    ->with('plan')
                    ->orderByDesc('ends_at'),
            ])
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Cálculo de estados
        |--------------------------------------------------------------------------
        */

        $total = $clients->count();

        $active = 0;
        $expiring = 0;
        $expired = 0;
        $withoutSubscription = 0;

        foreach ($clients as $client) {
            $subscription = $client->subscriptions->first();

            if (! $subscription) {
                $withoutSubscription++;

                continue;
            }

            $endsAt = Carbon::parse($subscription->ends_at);

            if ($endsAt->lt($today)) {
                $expired++;

                continue;
            }

            if ($endsAt->lte($next30Days)) {
                $expiring++;

                continue;
            }

            $active++;
        }

        /*
        |--------------------------------------------------------------------------
        | Resumen general
        |--------------------------------------------------------------------------
        |
        | Los estados se calculan exclusivamente desde ends_at.
        |
        */

        return [
            Stat::make('Total clientes', $total)
                ->description('Clientes registrados')
                ->descriptionIcon('heroicon-m-users')
                ->color('info')
                ->url(
                    ClientResource::getUrl('index')
                ),

            Stat::make('Activos', $active)
                ->description('Más de 30 días')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success')
                ->url(
                    ClientResource::getUrl('index', [
                        'client_status' => 'active',
                    ])
                ),

            Stat::make('Por vencer', $expiring)
                ->description('Dentro de 30 días')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning')
                ->url(
                    ClientResource::getUrl('index', [
                        'client_status' => 'expiring',
                    ])
                ),

            Stat::make('Vencidos', $expired)
                ->description('Suscripción vencida')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger')
                ->url(
                    ClientResource::getUrl('index', [
                        'client_status' => 'expired',
                    ])
                ),

            Stat::make('Sin suscripción', $withoutSubscription)
                ->description('Sin suscripción')
                ->descriptionIcon('heroicon-m-minus-circle')
                ->color('gray')
                ->url(
                    ClientResource::getUrl('index', [
                        'client_status' => 'without_subscription',
                    ])
                ),
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Layout
    |--------------------------------------------------------------------------
    */

    public function getColumns(): int|array
    {
        return [
            'default' => 2,
            'sm' => 3,
            'md' => 5,
            'lg' => 5,
            'xl' => 5,
        ];
    }
}