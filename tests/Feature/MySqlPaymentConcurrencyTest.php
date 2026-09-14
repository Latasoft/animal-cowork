<?php

use App\Models\Payment;
use App\Models\PaymentNotification;
use App\Models\Plan;
use App\Models\Purchase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\Process\Process;

test('mysql concurrent purchase and commit produce a single payment and notification event', function () {
    if (DB::getDriverName() !== 'mysql' || DB::connection()->getDatabaseName() !== 'animal_cowork_webpay_test') {
        $this->markTestSkipped('Run against the isolated animal_cowork_webpay_test MySQL database.');
    }

    $plan = Plan::factory()->create();
    $operation = (string) Str::uuid();
    $workerPath = storage_path('framework/testing/payment-worker-'.Str::uuid().'.php');
    if (! is_dir(dirname($workerPath))) {
        mkdir(dirname($workerPath), 0775, true);
    }
    $worker = <<<'PHP'
<?php
require getcwd().'/vendor/autoload.php';
$app = require getcwd().'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
if (Illuminate\Support\Facades\DB::connection()->getDatabaseName() !== 'animal_cowork_webpay_test') {
    exit(2);
}
config(['payments.lock_store' => 'database', 'mail.default' => 'array', 'queue.default' => 'database', 'services.contracts.reception_email' => 'team@example.test']);
Illuminate\Support\Facades\Queue::fake();
$app->instance(App\Contracts\PaymentGateway::class, new Tests\FakePaymentGateway);
if ($argv[1] === 'create') {
    $plan = App\Models\Plan::query()->findOrFail((int) $argv[2]);
    $payment = $app->make(App\Services\Payments\PurchaseService::class)->start($plan, 'race@example.test', '+56912345678', $argv[3]);
} else {
    $payment = App\Models\Payment::query()->findOrFail((int) $argv[2]);
    $app->make(App\Services\Payments\PaymentService::class)->resolve($payment, true);
}
PHP;
    file_put_contents($workerPath, $worker);
    try {
        $processes = [
            new Process([PHP_BINARY, $workerPath, 'create', (string) $plan->id, $operation], base_path()),
            new Process([PHP_BINARY, $workerPath, 'create', (string) $plan->id, $operation], base_path()),
        ];
        foreach ($processes as $process) {
            $process->setTimeout(90)->start();
        }
        foreach ($processes as $process) {
            expect($process->wait())->toBe(0, $process->getErrorOutput());
        }
        $purchase = Purchase::query()->where('operation_key', $operation)->firstOrFail();
        $payment = $purchase->payments()->firstOrFail();
        expect($purchase->payments()->count())->toBe(1);
        $purchase->update(['product_type' => 'patent']);
        $processes = [
            new Process([PHP_BINARY, $workerPath, 'commit', (string) $payment->id], base_path()),
            new Process([PHP_BINARY, $workerPath, 'commit', (string) $payment->id], base_path()),
        ];
        foreach ($processes as $process) {
            $process->setTimeout(90)->start();
        }
        foreach ($processes as $process) {
            expect($process->wait())->toBe(0, $process->getErrorOutput());
        }
        expect($payment->refresh()->status)->toBe(Payment::PAID)
            ->and(PaymentNotification::query()->where('notifiable_type', 'purchase')->where('notifiable_id', $purchase->id)->count())->toBe(2);
    } finally {
        foreach ($processes ?? [] as $process) {
            if ($process->isRunning()) {
                $process->stop();
            }
        }
        DB::transaction(function () use ($operation, $plan): void {
            $purchase = Purchase::query()->where('operation_key', $operation)->first();
            if ($purchase) {
                PaymentNotification::query()->where('notifiable_type', 'purchase')->where('notifiable_id', $purchase->id)->delete();
                $purchase->payments()->delete();
                $purchase->delete();
            }
            $plan->forceDelete();
        });
        unlink($workerPath);
    }
});
