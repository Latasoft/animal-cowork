<?php

namespace App\Console\Commands;

use App\Jobs\SendPaymentNotification;
use App\Models\Payment;
use App\Models\PaymentNotification;
use App\Services\Payments\PaymentService;
use Illuminate\Console\Command;

class ReconcilePayments extends Command
{
    protected $signature = 'payments:reconcile';

    protected $description = 'Reconcile pending Webpay payments and dispatch pending notifications';

    public function handle(PaymentService $payments): int
    {
        Payment::query()->whereIn('status', [Payment::PENDING, Payment::VERIFYING])
            ->where('check_attempts', '<', config('payments.max_status_checks'))
            ->where(function ($query) {
                $query->whereNull('checked_at')->orWhere('checked_at', '<', now()->subMinute());
            })->orderBy('id')->limit(50)->get()->each(fn (Payment $payment) => $payments->resolve($payment));
        PaymentNotification::query()->where('status', 'sending')->where('sending_at', '<', now()->subMinutes(5))->update(['status' => 'review']);
        PaymentNotification::query()->where('status', 'pending')->limit(100)->get()
            ->each(fn (PaymentNotification $notification) => SendPaymentNotification::dispatch($notification->id)->onConnection('database'));

        return self::SUCCESS;
    }
}
