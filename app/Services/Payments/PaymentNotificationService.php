<?php

namespace App\Services\Payments;

use App\Jobs\SendPaymentNotification;
use App\Models\Payment;
use App\Models\PaymentNotification;
use App\Models\Purchase;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PaymentNotificationService
{
    /** @param array<string, mixed> $payload */
    public function record(Model $subject, string $event, string $recipientType, ?string $recipient, array $payload): void
    {
        $notification = PaymentNotification::query()->firstOrCreate([
            'notifiable_type' => $subject->getMorphClass(),
            'notifiable_id' => $subject->getKey(),
            'event' => $event,
            'recipient' => mb_strtolower(trim($recipient ?? '')),
        ], ['recipient_type' => $recipientType, 'payload' => $payload]);
        if ($notification->status === 'pending') {
            DB::afterCommit(fn () => SendPaymentNotification::dispatch($notification->id)->onConnection('database'));
        }
    }

    public function service(Purchase $purchase, Payment $payment): void
    {
        $payload = [
            'name' => $purchase->snapshot['name'], 'email' => $purchase->email, 'phone' => $purchase->phone,
            'amount' => $payment->amount, 'date' => $payment->paid_at?->toIso8601String(), 'reference' => $payment->buy_order,
        ];
        foreach (['client' => $purchase->email, 'internal' => config('services.contracts.reception_email')] as $type => $email) {
            $this->record($purchase, 'service_paid', $type, $email, $payload);
        }
    }

    public function plan(Purchase $purchase, Payment $payment): void
    {
        $this->record($purchase, 'plan_paid', 'client', $purchase->email, [
            'name' => $purchase->snapshot['name'], 'amount' => $payment->amount,
            'reference' => $payment->buy_order,
            'continuation_url' => \Illuminate\Support\Facades\URL::temporarySignedRoute('payments.result', now()->addDay(), ['payment' => $payment]),
        ]);
    }
}
