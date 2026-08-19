<?php

namespace App\Services\MeetingRooms;

use App\Models\Client;
use App\Models\Reservation;
use App\Models\Subscription;
use App\Support\ChileanRut;
use Carbon\CarbonImmutable;

class CompanyLookupService
{
    /**
     * @return array{client: Client|null, subscription: Subscription|null, available_included_minutes: int, used_included_minutes: int}
     */
    public function context(string $companyRut, CarbonImmutable $date, bool $lock = false): array
    {
        $clientQuery = Client::query()
            ->whereIn('company_rut', ChileanRut::databaseVariants($companyRut));

        if ($lock) {
            $clientQuery->lockForUpdate();
        }

        $client = $clientQuery->first();

        if (! $client) {
            return [
                'client' => null,
                'subscription' => null,
                'available_included_minutes' => 0,
                'used_included_minutes' => 0,
            ];
        }

        $subscriptionQuery = $client->subscriptions()
            ->with('plan:id,slug,name')
            ->where('status', Subscription::STATUS_ACTIVE)
            ->where('includes_room_access', true)
            ->whereDate('starts_at', '<=', $date)
            ->whereDate('ends_at', '>=', $date)
            ->latest('starts_at');

        if ($lock) {
            $subscriptionQuery->lockForUpdate();
        }

        $subscription = $subscriptionQuery->first();

        if (! $subscription || $client->status !== Client::STATUS_ACTIVE) {
            return [
                'client' => $client,
                'subscription' => null,
                'available_included_minutes' => 0,
                'used_included_minutes' => 0,
            ];
        }

        $usedIncludedMinutes = (int) Reservation::query()
            ->where('subscription_id', $subscription->id)
            ->whereIn('status', Reservation::CONSUMED_BENEFIT_STATUSES)
            ->whereBetween('starts_at', [$date->startOfMonth(), $date->endOfMonth()])
            ->sum('included_minutes_used');

        return [
            'client' => $client,
            'subscription' => $subscription,
            'available_included_minutes' => max(
                0,
                (int) ($subscription->monthly_room_minutes_included - $usedIncludedMinutes),
            ),
            'used_included_minutes' => $usedIncludedMinutes,
        ];
    }

    /**
     * @param  array{client: Client|null, subscription: Subscription|null, available_included_minutes: int, used_included_minutes: int}  $context
     * @return array<string, mixed>
     */
    public function publicSummary(array $context): array
    {
        $client = $context['client'];
        $subscription = $context['subscription'];

        return [
            'client_found' => $client !== null,
            'has_active_plan' => $subscription !== null,
            'company_name' => $client?->company_name,
            'plan' => $subscription ? [
                'slug' => $subscription->plan->slug,
                'name' => $subscription->plan->name,
            ] : null,
            'included_minutes' => $subscription ? $subscription->monthly_room_minutes_included : 0,
            'used_included_minutes' => $context['used_included_minutes'],
            'available_included_minutes' => $context['available_included_minutes'],
        ];
    }
}
