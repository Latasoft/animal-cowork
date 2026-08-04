<?php

use App\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/checkout/{plan}', [CheckoutController::class, 'show'])
    ->name('checkout.show');

Route::post('/checkout', [CheckoutController::class, 'store'])
    ->name('checkout.store');