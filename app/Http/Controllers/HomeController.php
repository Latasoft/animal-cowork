<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanResource;
use App\Models\Plan;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('welcome', [
            'plans' => PlanResource::collection(
                Plan::query()->active()->ordered()->get(),
            )->resolve(),
        ]);
    }
}
