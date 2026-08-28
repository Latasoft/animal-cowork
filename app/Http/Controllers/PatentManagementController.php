<?php

namespace App\Http\Controllers;

use App\Models\PatentManagementService;
use Inertia\Inertia;
use Inertia\Response;

class PatentManagementController extends Controller
{
    public function __invoke(): Response
    {
        $service = PatentManagementService::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->firstOrFail();

        return Inertia::render('services/patent-management', [
            'service' => $service,
        ]);
    }
}