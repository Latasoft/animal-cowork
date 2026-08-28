<?php

namespace App\Http\Controllers;

use App\Models\CompanyFormationService;
use Inertia\Inertia;
use Inertia\Response;

class CompanyFormationController extends Controller
{
    public function __invoke(): Response
    {
        $service = CompanyFormationService::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->firstOrFail();

        return Inertia::render('company-formation', [
            'service' => $service,
        ]);
    }
}