<?php

use App\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get(
    '/checkout/{plan}/datos',
    [CheckoutController::class, 'showContractData'],
)->name('checkout.data');

Route::post(
    '/checkout/{plan}/payment',
    [CheckoutController::class, 'processPayment'],
)->name('checkout.payment');

Route::get(
    '/checkout/{plan}',
    [CheckoutController::class, 'show'],
)->name('checkout.show');