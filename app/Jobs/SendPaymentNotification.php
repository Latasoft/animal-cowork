<?php

namespace App\Jobs;

use App\Mail\ContractConfirmedToClient;
use App\Mail\ContractConfirmedToCompany;
use App\Mail\MeetingRoomReservationConfirmed;
use App\Mail\ServicePaymentConfirmed;
use App\Mail\PlanPaymentConfirmed;
use App\Models\Client;
use App\Models\PaymentNotification;
use App\Models\Plan;
use App\Models\Reservation;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendPaymentNotification implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public int $timeout = 60;

    public function __construct(public int $notificationId) {}

    public function handle(): void
    {
        $notification = PaymentNotification::query()->findOrFail($this->notificationId);
        if ($notification->recipient === '') {
            $notification->update(['status' => 'review']);

            return;
        }
        if (! PaymentNotification::query()->whereKey($notification->id)->where('status', 'pending')->update(['status' => 'sending', 'sending_at' => now()])) {
            return;
        }
        try {
            $payload = $notification->payload;
            if ($notification->event === 'contract_confirmed') {
                $client = new Client;
                $client->setRawAttributes($payload['client'], true);
                $plan = new Plan;
                $plan->setRawAttributes($payload['plan'], true);
                $pdf = base64_decode($payload['pdf'], true);
                if ($pdf === false) {
                    throw new \RuntimeException('Invalid stored contract.');
                }
                $mail = $notification->recipient_type === 'internal'
                    ? new ContractConfirmedToCompany($client, $plan, $pdf, $payload['pdf_name'])
                    : new ContractConfirmedToClient($client, $plan);
            } elseif ($notification->event === 'reservation_confirmed') {
                $mail = new MeetingRoomReservationConfirmed(Reservation::query()->findOrFail($notification->notifiable_id));
            } elseif ($notification->event === 'plan_paid') {
                $mail = new PlanPaymentConfirmed($payload);
            } else {
                $mail = new ServicePaymentConfirmed($payload, $notification->recipient_type === 'internal');
            }
            Mail::to($notification->recipient)->send($mail);
            $notification->update(['status' => 'sent', 'sent_at' => now(), 'payload' => []]);
        } catch (Throwable $exception) {
            $notification->update(['status' => 'review']);
            \Illuminate\Support\Facades\Log::error('Payment notification requires review.', ['notification_id' => $notification->id, 'event' => $notification->event, 'exception_type' => $exception::class]);
        }
    }

    public function failed(?Throwable $exception): void
    {
        PaymentNotification::query()->whereKey($this->notificationId)->where('status', '!=', 'sent')->update(['status' => 'review']);
    }
}
