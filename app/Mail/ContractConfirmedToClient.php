<?php

namespace App\Mail;

use App\Models\Client;
use App\Models\Plan;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ContractConfirmedToClient extends Mailable
{
    public function __construct(
        public Client $client,
        public Plan $plan,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tu contratación de Oficina Virtual ha sido registrada',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.contract-confirmed-to-client',
            with: [
                'displayName' => $this->client->representative_name,
                'planName' => $this->plan->name,
                'totalPrice' => $this->plan->total_price,
                'durationMonths' => $this->plan->contract_duration_months,
            ],
        );
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
