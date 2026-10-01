<?php

namespace App\Services\Payments;

use App\Models\Coupon;
use App\Models\Plan;
use Illuminate\Validation\ValidationException;

class CouponService
{
    /**
     * Revisa si un cupón se puede usar en un plan y calcula el descuento.
     *
     * @return array{coupon: Coupon, subtotal: int, discount: int, total: int}
     *
     * @throws ValidationException
     */
    public function evaluate(string $code, Plan $plan, string $flow): array
    {
        $code = Coupon::normalizeCode($code);
        $coupon = $code === '' ? null : Coupon::query()->where('code', $code)->first();

        if (! $coupon || ! $coupon->is_active) {
            $this->fail('El cupón ingresado no existe o no está disponible.');
        }

        $today = now('America/Santiago')->startOfDay();

        if ($coupon->starts_at && $coupon->starts_at->startOfDay()->gt($today)) {
            $this->fail('Este cupón aún no está vigente.');
        }

        if ($coupon->ends_at && $coupon->ends_at->startOfDay()->lt($today)) {
            $this->fail('Este cupón está vencido.');
        }

        if ($coupon->max_uses !== null && $coupon->used_count >= $coupon->max_uses) {
            $this->fail('Este cupón ya alcanzó su máximo de usos.');
        }

        if ($coupon->applies_to === 'checkout' && $flow === 'renewal') {
            $this->fail('Este cupón no aplica para renovaciones.');
        }

        if ($coupon->applies_to === 'renewal' && $flow !== 'renewal') {
            $this->fail('Este cupón es solo para renovaciones.');
        }

        $planIds = array_map('intval', $coupon->plan_ids ?? []);
        if ($planIds !== [] && ! in_array((int) $plan->id, $planIds, true)) {
            $this->fail('Este cupón no aplica para el plan seleccionado.');
        }

        $subtotal = (int) $plan->total_price;
        $discount = $coupon->discountFor($subtotal);
        $total = $subtotal - $discount;

        // Webpay necesita un monto mayor a cero.
        if ($discount < 1 || $total < 1) {
            $this->fail('Este cupón no se puede aplicar a este plan.');
        }

        return ['coupon' => $coupon, 'subtotal' => $subtotal, 'discount' => $discount, 'total' => $total];
    }

    private function fail(string $message): never
    {
        throw ValidationException::withMessages(['discount_code' => $message]);
    }
}
