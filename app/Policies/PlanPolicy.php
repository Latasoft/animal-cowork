<?php

namespace App\Policies;

use App\Models\Plan;
use App\Models\User;

class PlanPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->canManagePlans();
    }

    public function view(User $user, Plan $plan): bool
    {
        return $user->canManagePlans();
    }

    public function create(User $user): bool
    {
        return $user->canManagePlans();
    }

    public function update(User $user, Plan $plan): bool
    {
        return $user->canManagePlans();
    }

    public function delete(User $user, Plan $plan): bool
    {
        return $user->canManagePlans()
            && ! $plan->subscriptions()->exists();
    }

    public function restore(User $user, Plan $plan): bool
    {
        return $user->canManagePlans();
    }

    public function forceDelete(User $user, Plan $plan): bool
    {
        return $user->canManagePlans()
            && ! $plan->subscriptions()->exists();
    }

    public function deleteAny(User $user): bool
    {
        return false;
    }

    public function forceDeleteAny(User $user): bool
    {
        return false;
    }

    public function restoreAny(User $user): bool
    {
        return $user->canManagePlans();
    }
}
