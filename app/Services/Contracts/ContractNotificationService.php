<?php

namespace App\Services\Contracts;

use App\Mail\ContractConfirmedToClient;
use App\Mail\ContractConfirmedToCompany;
use App\Models\Client;
use App\Models\Plan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContractNotificationService
{
    public function send(
        Client $client,
        Plan $plan,
        string $pdfBytes,
        string $pdfName,
    ): void {
        $this->sendToCompany($client, $plan, $pdfBytes, $pdfName);
        $this->sendToClient($client, $plan);
    }

    private function sendToCompany(
        Client $client,
        Plan $plan,
        string $pdfBytes,
        string $pdfName,
    ): void {
        $recipient = config('services.contracts.reception_email');

        if (! is_string($recipient) || $recipient === '') {
            Log::warning('Contract reception email is not configured.', [
                'client_id' => $client->id,
                'plan_id' => $plan->id,
            ]);

            return;
        }

        try {
            Mail::to($recipient)->send(
                new ContractConfirmedToCompany($client, $plan, $pdfBytes, $pdfName),
            );
        } catch (Throwable $exception) {
            Log::error('Contract confirmation email to company could not be sent.', [
                'client_id' => $client->id,
                'plan_id' => $plan->id,
                'exception' => $exception::class,
            ]);
        }
    }

    private function sendToClient(Client $client, Plan $plan): void
    {
        if (blank($client->email)) {
            Log::warning('Contract client email is not configured.', [
                'client_id' => $client->id,
            ]);

            return;
        }

        try {
            Mail::to($client->email)->send(
                new ContractConfirmedToClient($client, $plan),
            );
        } catch (Throwable $exception) {
            Log::error('Contract confirmation email to client could not be sent.', [
                'client_id' => $client->id,
                'plan_id' => $plan->id,
                'exception' => $exception::class,
            ]);
        }
    }
}
