<?php

namespace App\Services\Contracts;

use App\Models\Client;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use App\Services\Payments\PaymentNotificationService;
use App\Services\Payments\TransferPurchaseService;

class ContractNotificationService
{
    public function __construct(private PaymentNotificationService $notifications) {}

    public function send(Client $client, Plan $plan, string $pdfBytes, string $pdfName, Subscription $subscription): void
    {
        $purchase = $subscription->purchase;
        $isRenewal = $purchase?->flow === 'renewal';
        $payment = $purchase?->payments()->where('status', Payment::PAID)->latest('id')->first();
        $paymentDate = $payment?->transaction_date ?? $payment?->paid_at;

        $payload = [
            'client' => $client->getAttributes(),
            'plan' => $plan->getAttributes(),
            'pdf' => base64_encode($pdfBytes),
            'pdf_name' => $pdfName,
            'flow' => $isRenewal ? 'renewal' : 'checkout',
            'payment' => $payment ? [
                'buy_order' => $payment->buy_order,
                'authorization_code' => (string) ($payment->authorization_code ?? ''),
                'date' => $paymentDate?->timezone('America/Santiago')->format('d/m/Y H:i') ?? '',
                'method' => TransferPurchaseService::isTransfer($payment) ? 'transfer' : 'webpay',
            ] : null,
        ];

        // Las renovaciones van a posventa. Si ese correo no está configurado,
        // se usa el mismo correo de las contrataciones nuevas.
        $internalEmail = $isRenewal
            ? (config('services.renewals.reception_email') ?: config('services.contracts.reception_email'))
            : config('services.contracts.reception_email');

        foreach (['client' => $client->email, 'internal' => $internalEmail] as $type => $email) {
            $this->notifications->record($subscription, 'contract_confirmed', $type, $email, $payload);
        }
    }
}
