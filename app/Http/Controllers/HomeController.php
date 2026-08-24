<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanResource;
use App\Models\Plan;
use App\Support\SafeDatabaseQuery;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(private SafeDatabaseQuery $database) {}

    public function __invoke(): Response
    {
        $plans = $this->database->run(
            callback: fn (): array => PlanResource::collection(
                Plan::query()->active()->ordered()->get(),
            )->resolve(),
            fallback: [],
            component: 'home.plans',
            model: Plan::class,
            operation: 'list_active_plans',
        );

        return Inertia::render('welcome', [
            'plans' => $plans->value,
            'plansUnavailable' => $plans->unavailable,
        ]);
    }
}
