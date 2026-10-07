<?php

namespace App\Services\Payments;

use App\Models\CompanyFormationService;
use App\Models\Coupon;
use App\Models\PatentManagementService;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Purchase;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PurchaseService
{
    public function __construct(private PaymentService $payments, private CouponService $coupons) {}

    /**
     * Huella de los datos de una compra. Si cambia, es otra compra.
     */
    public static function requestHash(Plan|PatentManagementService|CompanyFormationService $product, string $email, string $phone, string $flow = 'checkout', string $couponCode = ''): string
    {
        return hash('sha256', json_encode([$product->getMorphClass(), $product->id, $email, $phone, $flow, Coupon::normalizeCode($couponCode)], JSON_THROW_ON_ERROR));
    }

    public function start(Plan|PatentManagementService|CompanyFormationService $product, string $email, string $phone, string $operation, string $flow = 'checkout', string $couponCode = ''): Payment
    {
        $couponCode = Coupon::normalizeCode($couponCode);
        $hash = self::requestHash($product, $email, $phone, $flow, $couponCode);
        $payment = DB::transaction(function () use ($product, $email, $phone, $operation, $flow, $hash, $couponCode): Payment {
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
            $subtotal = $amount;
            $discount = 0;
            $coupon = null;
            // Los cupones aplican solo a los planes (contratación y renovación).
            if ($couponCode !== '' && $product instanceof Plan) {
                $result = $this->coupons->evaluate($couponCode, $product, $flow);
                $coupon = $result['coupon'];
                $discount = $result['discount'];
                $amount = $result['total'];
                $snapshot['coupon'] = ['code' => $coupon->code, 'discount' => $discount, 'subtotal' => $subtotal];
            }
            $purchase = Purchase::query()->create([
                'operation_key' => $operation, 'request_hash' => $hash,
                'product_type' => $product->getMorphClass(), 'product_id' => $product->id,
                'coupon_id' => $coupon?->id, 'coupon_code' => $coupon?->code,
                'email' => $email, 'phone' => $phone,
                'subtotal_amount' => $subtotal, 'discount_amount' => $discount,
                'amount' => $amount, 'snapshot' => $snapshot, 'flow' => $flow,
            ]);

            return $this->payments->pending($purchase, $amount, $operation);
        }, attempts: 5);

        return $this->payments->start($payment);
    }
}
