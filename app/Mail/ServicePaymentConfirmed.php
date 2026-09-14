<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ServicePaymentConfirmed extends Mailable
{
    /** @param array<string, mixed> $details */
    public function __construct(public array $details, public bool $internal = false) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->internal ? 'Servicio pagado: nueva solicitud' : 'Confirmación de pago — Animal Co-work');
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.service-payment-confirmed');
    }
}
