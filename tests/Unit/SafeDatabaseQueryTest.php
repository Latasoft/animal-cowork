<?php

use App\Models\Plan;
use App\Support\SafeDatabaseQuery;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

uses(TestCase::class);

it('returns a fallback and logs database query failures with context', function () {
    Log::spy();
    $exception = new QueryException(
        'mysql',
        'select * from plans',
        [],
        new PDOException('could not find driver'),
    );

    $result = (new SafeDatabaseQuery)->run(
        callback: fn () => throw $exception,
        fallback: [],
        component: 'home.plans',
        model: Plan::class,
        operation: 'list_active_plans',
    );

    expect($result->value)->toBe([])
        ->and($result->unavailable)->toBeTrue();

    Log::shouldHaveReceived('error')
        ->once()
        ->withArgs(fn (string $message, array $context): bool => $message === 'Database operation unavailable.'
            && $context['component'] === 'home.plans'
            && $context['model'] === Plan::class
            && $context['operation'] === 'list_active_plans'
            && $context['exception'] === $exception);
});

it('does not hide programming errors', function () {
    (new SafeDatabaseQuery)->run(
        callback: fn () => throw new LogicException('Application bug'),
        fallback: [],
        component: 'test',
        model: Plan::class,
        operation: 'test_operation',
    );
})->throws(LogicException::class, 'Application bug');
