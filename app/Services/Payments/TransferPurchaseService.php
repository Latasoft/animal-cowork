<?php

namespace App\Services\Payments;

use App\Models\Payment;
use App\Models\Plan;
use App\Models\Purchase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Registra contrataciones pagadas por transferencia (sin Webpay).
 *
 * Crea la compra y un pago marcado como pagado, y entrega un enlace firmado
 * para completar los mismos pasos de siempre: datos del contrato y
 * previsualización. Así el contrato y los correos se generan igual que
 * en una compra con Webpay.
 */
class TransferPurchaseService
{
    public const ENVIRONMENT = 'transfer';

    public const LINK_DAYS = 7;

    public function create(Plan $plan, string $flow, string $email, string $phone, int $amount, ?string $reference = null): Purchase
    {
        if ($amount < 1) {
            throw ValidationException::withMessages(['amount' => 'El monto pagado debe ser mayor a cero.']);
        }

        $flow = $flow === 'renewal' ? 'renewal' : 'checkout';
        $reference = trim((string) $reference) !== '' ? Str::limit(trim((string) $reference), 30, '') : null;
        $subtotal = (int) $plan->total_price;

        return DB::transaction(function () use ($plan, $flow, $email, $phone, $amount, $reference, $subtotal): Purchase {
            $operation = (string) Str::uuid();

            $purchase = Purchase::query()->create([
                'operation_key' => $operation,
                'request_hash' => hash('sha256', $operation),
                'product_type' => $plan->getMorphClass(),
                'product_id' => $plan->id,
                'email' => $email,
                'phone' => $phone,
                'subtotal_amount' => $subtotal,
                'discount_amount' => max(0, $subtotal - $amount),
                'amount' => $amount,
                'snapshot' => [
                    'name' => $plan->name,
                    'plan' => $plan->getAttributes(),
                    'transfer' => ['reference' => $reference, 'registered_by' => auth()->id()],
                ],
                'status' => 'awaiting_contract',
                'flow' => $flow,
            ]);

            $purchase->payments()->create([
                'public_id' => (string) Str::uuid(),
                'idempotency_key' => $operation,
                'amount' => $amount,
                'environment' => self::ENVIRONMENT,
                'buy_order' => 'TRF-'.strtoupper(Str::random(22)),
                'session_id' => (string) Str::uuid(),
                'status' => Payment::PAID,
                'provider_status' => 'TRANSFER',
                'authorization_code' => $reference,
                'transaction_date' => now(),
                'paid_at' => now(),
                'expires_at' => now(),
            ]);

            return $purchase;
        });
    }

    /**
     * Enlace firmado para completar los datos y el contrato.
     */
    public function link(Purchase $purchase): string
    {
        return URL::temporarySignedRoute(
            'checkout.transfer',
            now()->addDays(self::LINK_DAYS),
            ['purchase' => $purchase->id],
        );
    }

    public static function isTransfer(?Payment $payment): bool
    {
        return $payment?->environment === self::ENVIRONMENT;
    }
}
