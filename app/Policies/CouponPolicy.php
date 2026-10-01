<?php

namespace App\Policies;

use App\Models\Coupon;
use App\Models\User;

class CouponPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canManagePlans();
    }

    public function view(User $user, Coupon $coupon): bool
    {
        return $user->canManagePlans();
    }

    public function create(User $user): bool
    {
        return $user->canManagePlans();
    }

    public function update(User $user, Coupon $coupon): bool
    {
        return $user->canManagePlans();
    }

    // Un cupón ya usado no se elimina, para no perder el historial: se desactiva.
    public function delete(User $user, Coupon $coupon): bool
    {
        return $user->canManagePlans() && $coupon->used_count === 0;
    }

    public function deleteAny(User $user): bool
    {
        return false;
    }
}
