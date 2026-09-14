<?php

namespace App\Services\Payments;

use App\Models\CompanyFormationService;
use App\Models\PatentManagementService;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Purchase;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PurchaseService
{
    public function __construct(private PaymentService $payments) {}

    public function start(Plan|PatentManagementService|CompanyFormationService $product, string $email, string $phone, string $operation, string $flow = 'checkout'): Payment
    {
        $hash = hash('sha256', json_encode([$product->getMorphClass(), $product->id, $email, $phone, $flow], JSON_THROW_ON_ERROR));
        $payment = DB::transaction(function () use ($product, $email, $phone, $operation, $flow, $hash): Payment {
            $product = $product->newQuery()->whereKey($product->getKey())->lockForUpdate()->firstOrFail();
            $purchase = Purchase::query()->where('operation_key', $operation)->lockForUpdate()->first();
            if ($purchase) {
                if (! hash_equals($purchase->request_hash, $hash)) {
                    throw ValidationException::withMessages(['payment' => 'Esta operación ya tiene otros datos. Vuelve a iniciar la compra.']);
                }

                return $purchase->payments()->firstOrFail();
            }
            abort_unless($product->is_active, 404);
            [$amount, $snapshot] = match (true) {
                $product instanceof Plan => [$product->total_price, ['name' => $product->name, 'plan' => $product->getAttributes()]],
                $product instanceof PatentManagementService => [$product->service_price, ['name' => $product->title, 'service_price' => $product->service_price]],
                default => [$product->external_service_price + $product->virtual_office_price, ['name' => $product->title, 'external_service_price' => $product->external_service_price, 'virtual_office_price' => $product->virtual_office_price, 'virtual_office_duration' => $product->virtual_office_duration]],
            };
            if ($product instanceof PatentManagementService && $product->currency !== 'CLP') {
                throw ValidationException::withMessages(['payment' => 'El servicio debe tener un precio en pesos chilenos.']);
            }
            $purchase = Purchase::query()->create([
                'operation_key' => $operation, 'request_hash' => $hash,
                'product_type' => $product->getMorphClass(), 'product_id' => $product->id,
                'email' => $email, 'phone' => $phone, 'amount' => $amount, 'snapshot' => $snapshot, 'flow' => $flow,
            ]);

            return $this->payments->pending($purchase, $amount, $operation);
        }, attempts: 5);

        return $this->payments->start($payment);
    }
}
