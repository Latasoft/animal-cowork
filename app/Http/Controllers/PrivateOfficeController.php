<?php

namespace App\Http\Controllers;

use App\Models\PrivateOffice;
use Inertia\Inertia;
use Inertia\Response;

class PrivateOfficeController extends Controller
{
    public function __invoke(): Response
    {
        $offices = PrivateOffice::query()
            ->where('is_visible', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('private-offices', [
            'offices' => $offices,
        ]);
    }
}