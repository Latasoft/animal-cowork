<?php

namespace App\Services\Payments;

use App\Contracts\PaymentGateway;
use App\Models\Payment;
use App\Models\Purchase;
use App\Models\Reservation;
use App\Services\MeetingRooms\ReservationService;
use Illuminate\Cache\Repository;
use Illuminate\Contracts\Cache\Lock;
use Illuminate\Contracts\Cache\LockProvider;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Throwable;
use Transbank\Webpay\Options;

class PaymentService
{
    public function __construct(
        private PaymentGateway $gateway,
        private ReservationService $reservations,
        private PaymentNotificationService $notifications,
    ) {}

    public function pending(Model $payable, int $amount, string $operation): Payment
    {
        if ($amount < 1 || config('payments.environment') !== 'integration') {
            throw ValidationException::withMessages(['payment' => 'El pago no está disponible.']);
        }

        return Payment::query()->firstOrCreate(['idempotency_key' => $operation], [
            'public_id' => (string) Str::uuid(),
            'payable_type' => $payable->getMorphClass(),
            'payable_id' => $payable->getKey(),
            'amount' => $amount,
            'environment' => config('payments.environment'),
            'buy_order' => (string) Str::ulid(),
            'session_id' => (string) Str::uuid(),
            'expires_at' => now()->addMinutes(max(15, (int) config('payments.hold_minutes'))),
        ]);
    }

    public function start(Payment $payment): Payment
    {
        $claimed = Payment::query()->whereKey($payment->id)->whereNull('create_started_at')
            ->where('status', Payment::PENDING)->update(['create_started_at' => now()]);
        if (! $claimed) {
            return $payment->refresh();
        }
        $payment->refresh();
        try {
            $response = $this->gateway->create($payment, URL::temporarySignedRoute('payments.return', now()->addDay(), ['payment' => $payment->public_id]));
            $expectedHost = parse_url($payment->environment === 'integration'
                ? Options::BASE_URL_INTEGRATION
                : Options::BASE_URL_PRODUCTION, PHP_URL_HOST);
            if (! preg_match('/^[a-zA-Z0-9]{20,128}$/', $response['token'])
                || parse_url($response['url'], PHP_URL_SCHEME) !== 'https'
                || parse_url($response['url'], PHP_URL_HOST) !== $expectedHost) {
                throw new \RuntimeException('Invalid payment redirect.');
            }
            $payment->update([
                'token' => $response['token'],
                'token_hash' => hash('sha256', $response['token']),
                'redirect_url' => $response['url'],
            ]);
        } catch (Throwable $exception) {
            $payment->update(['status' => Payment::VERIFYING, 'review_reason' => 'create_unresolved']);
            $this->logFailure($payment, $exception);
        }

        return $payment->refresh();
    }

    public function resolve(Payment $payment, bool $commit = false): Payment
    {
        $lock = $this->operationLock($payment);
        if (! $lock->get()) {
            return $payment->refresh();
        }
        try {
            return $this->resolveLocked($payment, $commit);
        } finally {
            $lock->release();
        }
    }

    public function abandonFailedStart(Payment $payment): void
    {
        DB::transaction(function () use ($payment): void {
            $locked = Payment::query()->lockForUpdate()->findOrFail($payment->id);
            if ($locked->token || $locked->review_reason !== 'create_unresolved' || $locked->returned_at) {
                return;
            }
            $locked->update(['status' => Payment::FAILED, 'review_reason' => 'create_abandoned']);
            $payable = $locked->payable;
            if ($payable instanceof Reservation) {
                $payable->update(['status' => Reservation::STATUS_CANCELLED, 'payment_status' => Reservation::PAYMENT_UNPAID, 'cancelled_at' => now()]);
            } elseif ($payable instanceof Purchase) {
                $payable->update(['status' => Payment::FAILED]);
            }
        });
        $payment->refresh();
    }

    private function resolveLocked(Payment $payment, bool $commit, bool $forceStatus = false): Payment
    {
        $payment->refresh();
        if ($payment->isTerminal() && $payment->status !== Payment::EXPIRED) {
            return $payment;
        }
        if (! $payment->token) {
            if ($payment->expires_at->isPast()) {
                DB::transaction(function () use ($payment): void {
                    $payment = Payment::query()->lockForUpdate()->findOrFail($payment->id);
                    if ($payment->token || $payment->isTerminal()) {
                        return;
                    }
                    $payment->update(['status' => Payment::EXPIRED, 'review_reason' => 'not_sent_to_webpay']);
                    $payable = $payment->payable;
                    if ($payable instanceof Reservation) {
                        $payable->update(['status' => Reservation::STATUS_CANCELLED, 'cancelled_at' => now()]);
                    } elseif ($payable instanceof Purchase) {
                        $payable->update(['status' => Payment::EXPIRED]);
                    }
                });
            }

            return $payment->refresh();
        }
        $claimed = Payment::query()->whereKey($payment->id)
            ->when(! $forceStatus && (! $commit || $payment->commit_started_at), fn ($query) => $query->where(function ($query) {
                $query->whereNull('checked_at')->orWhere('checked_at', '<=', now()->subSeconds(30));
            }))->update(['checked_at' => now(), 'check_attempts' => DB::raw('check_attempts + 1')]);
        if (! $claimed) {
            return $payment->refresh();
        }
        try {
            if ($commit && Payment::query()->whereKey($payment->id)->whereNull('commit_started_at')->update(['commit_started_at' => now()])) {
                try {
                    $response = $this->gateway->commit($payment);
                } catch (Throwable $exception) {
                    $this->logFailure($payment, $exception);
                    $response = $this->gateway->status($payment);
                }
            } else {
                $response = $this->gateway->status($payment);
            }
            $this->applyResult($payment, $response);
        } catch (Throwable $exception) {
            Payment::query()->whereKey($payment->id)->where('status', '!=', Payment::PAID)
                ->update(['status' => Payment::VERIFYING, 'review_reason' => 'verification_unresolved']);
            $this->logFailure($payment, $exception);
        }

        return $payment->refresh();
    }

    /** @param array<string, mixed> $response */
    private function applyResult(Payment $payment, array $response): void
    {
        DB::transaction(function () use ($payment, $response): void {
            $payment = Payment::query()->lockForUpdate()->findOrFail($payment->id);
            if ($payment->isTerminal() && $payment->status !== Payment::EXPIRED) {
                return;
            }
            if ((string) ($response['buy_order'] ?? '') !== $payment->buy_order
                || (string) ($response['session_id'] ?? '') !== $payment->session_id
                || ! is_numeric($response['amount'] ?? null)
                || (float) $response['amount'] !== (float) $payment->amount) {
                $payment->update(['status' => Payment::VERIFYING, 'review_reason' => 'provider_identity_mismatch']);

                return;
            }
            $providerStatus = $response['status'] ?? '';
            $status = match ($providerStatus) {
                'AUTHORIZED' => ($response['response_code'] ?? null) === 0 ? Payment::PAID : Payment::VERIFYING,
                'FAILED', 'REVERSED', 'NULLIFIED', 'PARTIALLY_NULLIFIED' => Payment::FAILED,
                default => Payment::VERIFYING,
            };
            if ($providerStatus === 'INITIALIZED' && $payment->expires_at->isPast()) {
                $status = Payment::EXPIRED;
            }
            $payment->update([
                'status' => $status,
                'provider_status' => $providerStatus,
                'response_code' => $response['response_code'] ?? null,
                'authorization_code' => $response['authorization_code'] ?? null,
                'transaction_date' => $response['transaction_date'] ?? null,
                'paid_at' => $status === Payment::PAID ? now() : null,
                'review_reason' => $status === Payment::VERIFYING ? 'provider_pending' : null,
            ]);
            $payable = $payment->payable;
            if ($status === Payment::PAID) {
                try {
                    DB::transaction(function () use ($payment, $payable): void {
                        if ($payable instanceof Reservation) {
                            if (! $this->reservations->completePaid($payable)) {
                                $payment->update(['review_reason' => 'reservation_requires_review']);
                            }
                        } elseif ($payable instanceof Purchase) {
                            $payable->update(['status' => $payable->product_type === 'plan' ? 'awaiting_contract' : 'paid']);
                            if ($payable->product_type !== 'plan') {
                                $this->notifications->service($payable, $payment);
                            } else {
                                $this->notifications->plan($payable, $payment);
                            }
                        }
                    });
                } catch (Throwable $exception) {
                    $payment->update(['review_reason' => 'commercial_fulfillment_failed']);
                    $this->logFailure($payment, $exception);
                }
            } elseif (in_array($status, [Payment::FAILED, Payment::EXPIRED, Payment::CANCELLED], true)) {
                if ($payable instanceof Reservation) {
                    $payable->update(['status' => Reservation::STATUS_CANCELLED, 'cancelled_at' => now(), 'payment_status' => Reservation::PAYMENT_UNPAID]);
                } elseif ($payable instanceof Purchase) {
                    $payable->update(['status' => $status]);
                }
            }
        }, attempts: 5);
    }

    public function cancel(Payment $payment): Payment
    {
        $lock = $this->operationLock($payment);
        if (! $lock->get()) {
            return $payment->refresh();
        }
        try {
            return $this->cancelLocked($payment);
        } finally {
            $lock->release();
        }
    }

    private function cancelLocked(Payment $payment): Payment
    {
        $payment = $this->resolveLocked($payment, false, true);
        if ($payment->provider_status === 'INITIALIZED' && $payment->review_reason === 'provider_pending' && ! $payment->commit_started_at) {
            DB::transaction(function () use ($payment): void {
                $payment = Payment::query()->lockForUpdate()->findOrFail($payment->id);
                if ($payment->isTerminal() || $payment->commit_started_at) {
                    return;
                }
                $payment->update(['status' => Payment::CANCELLED]);
                $payable = $payment->payable;
                if ($payable instanceof Reservation) {
                    $payable->update(['status' => Reservation::STATUS_CANCELLED, 'cancelled_at' => now()]);
                } elseif ($payable instanceof Purchase) {
                    $payable->update(['status' => Payment::CANCELLED]);
                }
            });
        }

        return $payment->refresh();
    }

    private function operationLock(Payment $payment): Lock
    {
        $repository = Cache::store(config('payments.lock_store'));
        if (! $repository instanceof Repository) {
            throw new \LogicException('Payment cache must support locks.');
        }
        $store = $repository->getStore();
        if (! $store instanceof LockProvider) {
            throw new \LogicException('Payment cache must support locks.');
        }

        return $store->lock('payment-resolve-'.$payment->id, 90);
    }

    private function logFailure(Payment $payment, Throwable $exception): void
    {
        $context = ['payment_id' => $payment->id, 'exception_type' => $exception::class];
        if ($exception instanceof \GuzzleHttp\Exception\RequestException) {
            $context['http_status'] = $exception->getResponse()?->getStatusCode();
            $context['transport_errno'] = $exception->getHandlerContext()['errno'] ?? null;
        }
        Log::warning('Payment provider operation requires verification.', $context);
    }
}
