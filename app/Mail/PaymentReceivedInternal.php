<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class PaymentReceivedInternal extends Mailable
{
    /** @param array<string, mixed> $details */
    public function __construct(public array $details) {}

    public function envelope(): Envelope
    {
        $amount = number_format((int) ($this->details['amount'] ?? 0), 0, ',', '.');

        return new Envelope(
            subject: 'Nuevo pago recibido: $'.$amount.' — Orden '.($this->details['buy_order'] ?? ''),
        );
    }

    public function content(): Content
    {
        return new Content(markdown: 'mail.payment-received-internal');
    }
}
