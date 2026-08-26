<?php

namespace App\Filament\Resources\Clients\Widgets;

use App\Filament\Resources\Clients\ClientResource;
use App\Models\Client;
use App\Models\Plan;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ClientPlanDistributionChart extends StatsOverviewWidget
{
    protected ?string $pollingInterval = null;

    protected function getStats(): array
    {
        $clients = Client::query()
            ->with([
                'subscriptions' => fn ($query) => $query
                    ->with('plan')
                    ->orderByDesc('ends_at'),
            ])
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Contar clientes por plan actual
        |--------------------------------------------------------------------------
        */

        $planCounts = [];

        foreach ($clients as $client) {
            $subscription = $client->subscriptions->first();

            if (! $subscription || ! $subscription->plan) {
                continue;
            }

            $planId = $subscription->plan->id;

            $planCounts[$planId] = ($planCounts[$planId] ?? 0) + 1;
        }

        /*
        |--------------------------------------------------------------------------
        | Total de clientes que tienen plan
        |--------------------------------------------------------------------------
        */

        $totalWithPlan = array_sum($planCounts);

        /*
        |--------------------------------------------------------------------------
        | Colores visuales por posición
        |--------------------------------------------------------------------------
        |
        | Se mantienen sutiles y permiten distinguir rápidamente cada plan.
        |
        */

        $colors = [
            'info',
            'success',
            'warning',
            'danger',
            'gray',
        ];

        /*
        |--------------------------------------------------------------------------
        | Todos los planes existentes
        |--------------------------------------------------------------------------
        */

        return Plan::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->values()
            ->map(function (Plan $plan, int $index) use (
                $planCounts,
                $totalWithPlan,
                $colors
            ) {
                $count = $planCounts[$plan->id] ?? 0;

                $percentage = $totalWithPlan > 0
                    ? round(($count / $totalWithPlan) * 100, 1)
                    : 0;

                $clientLabel = $count === 1
                    ? 'cliente'
                    : 'clientes';

                $percentageLabel = rtrim(
                    rtrim(number_format($percentage, 1, ',', '.'), '0'),
                    ','
                );

                return Stat::make(
                    $plan->name,
                    $count . ' ' . $clientLabel
                )
                    ->description(
                        $percentageLabel . '% del total'
                    )
                    ->descriptionIcon('heroicon-m-chart-pie')
                    ->color(
                        $colors[$index % count($colors)]
                    )
                    ->url(
                        ClientResource::getUrl('index', [
                            'client_plan' => (string) $plan->id,
                        ])
                    );
            })
            ->all();
    }

    /*
    |--------------------------------------------------------------------------
    | Layout compacto
    |--------------------------------------------------------------------------
    */

    public function getColumns(): int|array
    {
        return [
            'default' => 2,
            'sm' => 2,
            'md' => 3,
            'lg' => 4,
            'xl' => 4,
        ];
    }
}