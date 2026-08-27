<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CompanyLookupController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MeetingRoomBookingController;
use App\Http\Controllers\MeetingRoomReservationController;
use App\Http\Controllers\RenewalController;
use App\Http\Controllers\RoomAvailabilityController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PrivateOfficeController;

Route::get('/', HomeController::class)->name('home');

Route::inertia(
    '/gestion-patente-comercial',
    'services/patent-management',
)->name('services.patent_management');

Route::get(
    '/agendamiento-de-sala-de-reuniones',
    [MeetingRoomBookingController::class, 'index'],
)->name('meeting_rooms.booking');

Route::get(
    '/agendamiento-de-sala-de-reuniones/disponibilidad',
    RoomAvailabilityController::class,
)->name('meeting_rooms.availability');

Route::post(
    '/agendamiento-de-sala-de-reuniones/consultar-empresa',
    CompanyLookupController::class,
)->middleware('throttle:30,1')->name('meeting_rooms.company_lookup');

Route::post(
    '/agendamiento-de-sala-de-reuniones/reservas',
    [MeetingRoomReservationController::class, 'store'],
)->middleware('throttle:10,1')->name('meeting_rooms.reservations.store');

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

Route::get('/renovar', RenewalController::class)
    ->name('contract.renew');

Route::inertia(
    '/constitucion-de-empresa',
    'company-formation',
)->name('company_formation.index');

Route::get(
    '/oficinas-privadas',
    PrivateOfficeController::class,
)->name('private_offices.index');
