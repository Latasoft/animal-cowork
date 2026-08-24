<?php

namespace App\Providers;

use App\Contracts\MeetingRooms\ReservationPaymentGateway;
use App\Services\MeetingRooms\SimulatedReservationPaymentGateway;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Inertia\ExceptionResponse;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            ReservationPaymentGateway::class,
            SimulatedReservationPaymentGateway::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureProductionExceptionResponses();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    protected function configureProductionExceptionResponses(): void
    {
        Inertia::handleExceptionsUsing(function (ExceptionResponse $response) {
            if (
                app()->environment(['local', 'testing'])
                || ! in_array($response->statusCode(), [403, 404, 500, 503], true)
            ) {
                return null;
            }

            return $response->render('error-page', [
                'status' => $response->statusCode(),
            ]);
        });
    }
}
