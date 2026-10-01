<?php

namespace App\Services\Payments;

use App\Jobs\SendPaymentNotification;
use App\Models\Payment;
use App\Models\PaymentNotification;
use App\Models\Purchase;
use App\Models\Reservation;
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

    /**
     * Aviso interno por cada pago aprobado en Webpay, con los datos
     * necesarios para cruzarlo con el portal de Transbank.
     */
    public function paymentReceived(Payment $payment): void
    {
        $date = $payment->transaction_date ?? $payment->paid_at ?? now();
        $details = [
            'kind' => 'Pago con Webpay',
            'flow' => null,
            'product' => '',
            'amount' => $payment->amount,
            'date' => $date->timezone('America/Santiago')->format('d/m/Y H:i'),
            'buy_order' => $payment->buy_order,
            'authorization_code' => (string) ($payment->authorization_code ?? ''),
            'company' => null,
            'rut' => null,
            'name' => null,
            'email' => null,
            'phone' => null,
            'note' => null,
            'coupon' => null,
        ];

        $payable = $payment->payable;
        if ($payable instanceof Purchase) {
            $details['kind'] = match ($payable->product_type) {
                'plan' => 'Plan de oficina virtual',
                'patent' => 'Gestión de patente',
                'formation' => 'Constitución de empresa',
                default => 'Servicio',
            };
            $details['product'] = (string) ($payable->snapshot['name'] ?? '');
            $details['email'] = $payable->email;
            $details['phone'] = $payable->phone;
            if ($payable->product_type === 'plan') {
                $details['flow'] = $payable->flow === 'renewal' ? 'Renovación' : 'Contratación nueva';
            }
            if ($payable->coupon_code) {
                $details['coupon'] = $payable->coupon_code.' (descuento de $'.number_format((int) $payable->discount_amount, 0, ',', '.').')';
            }
            $client = $payable->client;
            if ($client) {
                $details['company'] = $client->company_name;
                $details['rut'] = $client->company_rut;
            } elseif ($payable->product_type === 'plan') {
                $details['note'] = 'El nombre de la empresa y el RUT llegarán en el correo de contratación, cuando el cliente complete sus datos.';
            }
        } elseif ($payable instanceof Reservation) {
            $payable->loadMissing(['room', 'client']);
            $details['kind'] = 'Reserva de sala de reuniones';
            $details['product'] = (string) ($payable->room?->name ?? 'Sala de reuniones');
            $details['name'] = $payable->contact_name;
            $details['email'] = $payable->contact_email;
            $details['phone'] = $payable->contact_phone;
            $details['company'] = $payable->client?->company_name;
            $details['rut'] = $payable->client?->company_rut;
        }

        $this->record($payment, 'payment_received', 'internal', config('services.contracts.reception_email'), $details);
    }
}
