<?php

namespace App\Http\Controllers;

use App\Http\Requests\ServicePaymentRequest;
use App\Models\CompanyFormationService;
use App\Models\PatentManagementService;
use App\Models\Payment;
use App\Models\Purchase;
use App\Models\Reservation;
use App\Services\Payments\PaymentService;
use App\Services\Payments\PurchaseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class PaymentController extends Controller
{
    public function __construct(private PaymentService $payments, private PurchaseService $purchases) {}

    public function service(ServicePaymentRequest $request, string $type, string $slug): RedirectResponse
    {
        $model = match ($type) {
            'patent' => PatentManagementService::class,
            'formation' => CompanyFormationService::class,
            default => abort(404),
        };
        $product = $model::query()->where('slug', $slug)->where('is_active', true)->firstOrFail();
        $operation = self::operation($request, $type.'_'.$product->id);
        $payment = $this->purchases->start($product, $request->validated('email'), $request->validated('phone'), $operation);
        self::remember($request, $payment);

        return redirect()->route('payments.redirect', $payment);
    }

    public static function operation(Request $request, string $scope): string
    {
        $key = 'payment_operations.'.$scope;
        if (! $request->session()->has($key)) {
            $request->session()->put($key, (string) Str::uuid());
        }

        return $request->session()->get($key);
    }

    public static function remember(Request $request, Payment $payment): void
    {
        $request->session()->put('payment_access.'.$payment->public_id, true);
    }

    private function authorizePayment(Request $request, Payment $payment): void
    {
        abort_unless($request->session()->get('payment_access.'.$payment->public_id) === true || $request->hasValidSignature(), 403);
    }

    public function redirect(Request $request, Payment $payment): HttpResponse
    {
        $this->authorizePayment($request, $payment);
        self::remember($request, $payment);
        if (! $payment->token) {
            if ($payment->expires_at->isPast() && ! $payment->isTerminal()) {
                $this->payments->resolve($payment);
            }
            return Inertia::render('payments/start', [
                'paymentId' => $payment->public_id,
                'canRetry' => $payment->isTerminal() || $payment->review_reason === 'create_unresolved',
            ])->toResponse($request);
        }
        if ($payment->isTerminal() || $payment->expires_at->isPast()) {
            return redirect()->route('payments.result', $payment);
        }

        if ($request->header('X-Inertia')) {
            return Inertia::location($request->fullUrl());
        }

        $payment->update(['redirected_at' => $payment->redirected_at ?? now()]);
        return response()->view('payments.redirect', ['payment' => $payment])
            ->header('Cache-Control', 'no-store')->header('Referrer-Policy', 'no-referrer');
    }

    public function returned(Request $request): RedirectResponse
    {
        $token = $request->input('token_ws');
        $cancelToken = $request->input('TBK_TOKEN');
        if ((! is_string($token) || $token === '') && (! is_string($cancelToken) || $cancelToken === '')) {
            abort_unless($request->hasValidSignatureWhileIgnoring(['TBK_ORDEN_COMPRA', 'TBK_ID_SESION']), 400);
            $payment = Payment::query()->where('public_id', $request->query('payment'))->firstOrFail();
            $payment->update(['returned_at' => $payment->returned_at ?? now()]);
            $this->payments->resolve($payment);

            return redirect(URL::temporarySignedRoute('payments.result', now()->addDay(), ['payment' => $payment]));
        }
        $received = is_string($token) && $token !== '' ? $token : $cancelToken;
        abort_unless(is_string($received) && preg_match('/^[a-zA-Z0-9]{20,128}$/', $received) === 1, 400);
        $payment = Payment::query()->where('token_hash', hash('sha256', $received))->firstOrFail();
        if ($cancelToken) {
            abort_unless(! $token && $request->input('TBK_ORDEN_COMPRA') === $payment->buy_order
                && $request->input('TBK_ID_SESION') === $payment->session_id, 400);
            $payment->update(['returned_at' => $payment->returned_at ?? now()]);
            $payment = $this->payments->cancel($payment);
        } else {
            $payment->update(['returned_at' => $payment->returned_at ?? now()]);
            $payment = $this->payments->resolve($payment, commit: true);
        }

        return redirect(URL::temporarySignedRoute('payments.result', now()->addHours(24), ['payment' => $payment]))
            ->header('Cache-Control', 'no-store')->header('Referrer-Policy', 'no-referrer');
    }

    public function result(Request $request, Payment $payment): Response|RedirectResponse
    {
        $this->authorizePayment($request, $payment);
        self::remember($request, $payment);
        if (! $payment->token || (! $payment->returned_at && ! $payment->isTerminal())) {
            return redirect()->route('payments.redirect', $payment);
        }
        $purchase = $payment->payable;
        $continuation = null;
        if ($payment->status === Payment::PAID && $purchase instanceof Purchase && $purchase->product_type === 'plan') {
            $request->session()->put('checkout', ['purchase_id' => $purchase->id]);
            return redirect()->route('checkout.data', ['plan' => $purchase->snapshot['plan']['slug'], 'flow' => $purchase->flow])
                ->with('payment_confirmed_message', true);
        }

        return Inertia::render('payments/result', [
            'payment' => ['id' => $payment->public_id, 'status' => $payment->status, 'amount' => $payment->amount,
                'reference' => $payment->buy_order, 'requiresReview' => in_array($payment->review_reason, ['reservation_requires_review', 'commercial_fulfillment_failed'], true)],
            'continuationUrl' => $continuation,
            'businessType' => $purchase instanceof Reservation ? 'reservation' : ($purchase instanceof Purchase ? $purchase->product_type : null),
        ]);
    }

    public function status(Request $request, Payment $payment): RedirectResponse
    {
        $this->authorizePayment($request, $payment);
        $this->payments->resolve($payment);

        return redirect()->route('payments.result', $payment);
    }

    public function retry(Request $request, Payment $payment): RedirectResponse
    {
        $this->authorizePayment($request, $payment);
        $this->payments->abandonFailedStart($payment);
        abort_unless(in_array($payment->status, [Payment::FAILED, Payment::CANCELLED, Payment::EXPIRED], true), 409);
        $payable = $payment->payable;
        if ($payable instanceof Purchase) {
            $request->session()->forget('payment_operations.'.$payable->product_type.'_'.$payable->product_id);
            $route = match ($payable->product_type) {
                'plan' => route('checkout.show', ['plan' => $payable->snapshot['plan']['slug'], 'flow' => $payable->flow]),
                'patent' => route('services.patent_management'),
                'formation' => route('company_formation.index'),
                default => abort(404),
            };
        } elseif ($payable instanceof Reservation) {
            $request->session()->forget('payment_operations.reservation_'.$payable->request_hash);
            $route = route('meeting_rooms.booking');
        } else {
            abort(404);
        }

        return redirect($route);
    }
}
