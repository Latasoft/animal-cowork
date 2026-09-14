<?php

namespace App\Services\Contracts;

use App\Models\Client;
use App\Models\Plan;
use App\Models\Subscription;
use App\Services\Payments\PaymentNotificationService;

class ContractNotificationService
{
    public function __construct(private PaymentNotificationService $notifications) {}

    public function send(Client $client, Plan $plan, string $pdfBytes, string $pdfName, Subscription $subscription): void
    {
        $payload = ['client' => $client->getAttributes(), 'plan' => $plan->getAttributes(), 'pdf' => base64_encode($pdfBytes), 'pdf_name' => $pdfName];
        foreach (['client' => $client->email, 'internal' => config('services.contracts.reception_email')] as $type => $email) {
            $this->notifications->record($subscription, 'contract_confirmed', $type, $email, $payload);
        }
    }
}
