<?php

namespace App\Mail;

use App\Models\Client;
use App\Models\Plan;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ContractConfirmedToCompany extends Mailable
{
    public function __construct(
        public Client $client,
        public Plan $plan,
        private string $pdfBytes,
        private string $pdfName,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nueva contratación de Oficina Virtual',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.contract-confirmed-to-company',
            with: [
                'contractTypeLabel' => $this->contractTypeLabel(),
                'displayName' => $this->displayName(),
                'rut' => $this->rut(),
                'companyName' => $this->companyName(),
                'priceOffice' => $this->plan->price_office,
            ],
        );
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [
            Attachment::fromData(
                fn (): string => $this->pdfBytes,
                $this->pdfName,
            )->withMime('application/pdf'),
        ];
    }

    private function contractTypeLabel(): string
    {
        return $this->client->contract_type === 'natural'
            ? 'Persona natural'
            : 'Persona jurídica';
    }

    private function displayName(): string
    {
        return $this->client->representative_name;
    }

    private function rut(): string
    {
        return $this->client->company_rut;
    }

    private function companyName(): ?string
    {
        return $this->client->contract_type === 'natural'
            ? null
            : $this->client->company_name;
    }
}
