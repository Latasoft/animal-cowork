<?php

use App\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia(
    '/gestion-patente-comercial',
    'services/patent-management',
)->name('services.patent_management');

Route::inertia(
    '/agendamiento-de-sala-de-reuniones',
    'meeting-room-booking',
)->name('meeting_rooms.booking');

Route::get(
    '/checkout/{plan}/datos',
    [CheckoutController::class, 'showContractData'],
)->name('checkout.data');

Route::get(
    '/checkout/{plan}/contrato',
    [CheckoutController::class, 'showContractPreview'],
)->name('checkout.contract_preview');

Route::post(
    '/checkout/{plan}/payment',
    [CheckoutController::class, 'processPayment'],
)->name('checkout.payment');

Route::get(
    '/checkout/{plan}',
    [CheckoutController::class, 'show'],
)->name('checkout.show');

Route::inertia('/renovar', 'renew-contract')
    ->name('contract.renew');

Route::inertia(
    '/constitucion-de-empresa',
    'company-formation',
)->name('company_formation.index');  
