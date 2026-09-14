<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConfirmContractRequest;
use App\Http\Resources\PlanResource;
use App\Models\Client;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Purchase;
use App\Services\Contracts\ContractConfirmationService;
use App\Services\Payments\PurchaseService;
use App\Support\DatabaseQueryResult;
use App\Support\SafeDatabaseQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private SafeDatabaseQuery $database,
        private ContractConfirmationService $contractService,
        private PurchaseService $purchases,
    ) {}

    /**
     * Paso 1: muestra el plan, datos de contacto y pago.
     */
    public function show(Request $request, string $plan): Response
    {
        $selectedPlan = $this->findActivePlan($plan, 'show_checkout');

        return Inertia::render('checkout', [
            'plan' => $selectedPlan->value instanceof Plan
                ? (new PlanResource($selectedPlan->value))->resolve()
                : null,
            'planUnavailable' => $selectedPlan->unavailable,
            'flow' => $this->checkoutFlow($request),
        ]);
    }

    /**
     * Paso 1: valida los datos previos al pago.
     *
     * Crea una compra pendiente y dirige al usuario a Webpay.
     */
    public function processPayment(
        Request $request,
        string $plan,
    ): RedirectResponse {
        $planResult = $this->findActivePlan($plan, 'validate_checkout_payment');

        if ($planResult->unavailable) {
            return back()
                ->withInput()
                ->withErrors([
                    'plan_id' => 'No pudimos validar el plan en este momento. Intenta nuevamente más tarde.',
                ]);
        }

        $selectedPlan = $planResult->value;
        assert($selectedPlan instanceof Plan);

        $validated = $request->validate(
            [
                'plan_id' => [
                    'required',
                    'string',
                    Rule::in([$selectedPlan->slug]),
                ],

                'representative_email' => [
                    'required',
                    'string',
                    'email:rfc',
                    'max:150',
                ],

                'representative_whatsapp' => [
                    'required',
                    'string',
                    'max:20',
                    function (
                        string $attribute,
                        mixed $value,
                        \Closure $fail,
                    ): void {
                        $digits = preg_replace(
                            '/\D/',
                            '',
                            (string) $value,
                        );

                        /*
                         * Formatos válidos:
                         *
                         * 912345678
                         * 56912345678
                         * +56 9 1234 5678
                         */
                        if (! preg_match('/^(?:56)?9\d{8}$/', $digits)) {
                            $fail(
                                'Ingresa un número de WhatsApp chileno válido, por ejemplo +56 9 1234 5678.',
                            );
                        }
                    },
                ],

                'discount_code' => [
                    'nullable',
                    'string',
                    'max:30',
                ],

                'accept_terms' => [
                    'accepted',
                ],

                'accept_data_policy' => [
                    'accepted',
                ],
            ],
            [
                'plan_id.required' => 'Debes seleccionar un plan.',

                'plan_id.string' => 'El plan seleccionado no es válido.',

                'plan_id.in' => 'El plan seleccionado no es válido.',

                'representative_email.required' => 'Ingresa tu correo electrónico.',

                'representative_email.string' => 'El correo electrónico ingresado no es válido.',

                'representative_email.email' => 'Ingresa un correo electrónico válido.',

                'representative_email.max' => 'El correo electrónico no puede superar los 150 caracteres.',

                'representative_whatsapp.required' => 'Ingresa tu número de WhatsApp.',

                'representative_whatsapp.string' => 'El número de WhatsApp ingresado no es válido.',

                'representative_whatsapp.max' => 'El número de WhatsApp no puede superar los 20 caracteres.',

                'discount_code.string' => 'El cupón ingresado no es válido.',

                'discount_code.max' => 'El cupón no puede superar los 30 caracteres.',

                'accept_terms.accepted' => 'Debes aceptar los Términos y Condiciones.',

                'accept_data_policy.accepted' => 'Debes aceptar la Política de Privacidad.',
            ],
        );

        $flow = $this->checkoutFlow($request);
        $operation = PaymentController::operation($request, 'plan_'.$selectedPlan->id);
        $payment = $this->purchases->start($selectedPlan, $validated['representative_email'], $validated['representative_whatsapp'], $operation, $flow);
        PaymentController::remember($request, $payment);
        $request->session()->put('checkout', ['purchase_id' => $payment->payable_id]);

        return redirect()->route('payments.redirect', $payment);
    }

    /**
     * Paso 2: muestra el formulario con los datos necesarios
     * para elaborar el contrato.
     */
    public function showContractData(
        Request $request,
        string $plan,
    ): Response|RedirectResponse {
        $planResult = $this->findActivePlan($plan, 'show_contract_data');

        if ($planResult->unavailable) {
            return $this->redirectToUnavailableCheckout($plan);
        }

        $selectedPlan = $planResult->value;
        assert($selectedPlan instanceof Plan);

        $purchase = $this->paidPurchase($request, $plan);
        $checkout = $purchase ? ['email' => $purchase->email, 'whatsapp' => $purchase->phone, 'subtotal' => $purchase->amount, 'total' => $purchase->amount] : null;

        $hasConfirmedPayment =
            $purchase !== null;

        if (! $hasConfirmedPayment) {
            return redirect()
                ->route('checkout.show', [
                    'plan' => $plan,
                ])
                ->with(
                    'error',
                    'Debes confirmar el pago antes de ingresar los datos del contrato.',
                );
        }

        return Inertia::render('checkout-data', [
            'paymentConfirmed' => $request->session()->get('payment_confirmed_message', false),
            'plan' => (new PlanResource($purchase->purchasedPlan()))->resolve(),
            'flow' => $this->checkoutFlow($request),

            'customer' => [
                'email' => $checkout['email'] ?? '',
                'whatsapp' => $checkout['whatsapp'] ?? '',
            ],

            'payment' => [
                'subtotal' => $checkout['subtotal'] ?? 0,
                'discountCode' => null,
                'discountAmount' => 0,
                'total' => $checkout['total'] ?? 0,
                'confirmed' => true,
            ],
        ]);
    }

    /**
     * Paso 3: muestra la previsualización del contrato generado.
     */
    public function showContractPreview(
        Request $request,
        string $plan,
    ): Response|RedirectResponse {
        $planResult = $this->findActivePlan($plan, 'show_contract_preview');

        if ($planResult->unavailable) {
            return $this->redirectToUnavailableCheckout($plan);
        }

        $selectedPlan = $planResult->value;
        assert($selectedPlan instanceof Plan);

        $purchase = $this->paidPurchase($request, $plan);
        $checkout = $purchase ? ['email' => $purchase->email, 'whatsapp' => $purchase->phone, 'subtotal' => $purchase->amount, 'total' => $purchase->amount] : null;

        $hasConfirmedPayment =
            $purchase !== null;

        if (! $hasConfirmedPayment) {
            return redirect()
                ->route('checkout.show', [
                    'plan' => $plan,
                ])
                ->with(
                    'error',
                    'Debes confirmar el pago antes de previsualizar el contrato.',
                );
        }

        return Inertia::render('contract-preview', [
            'plan' => (new PlanResource($purchase->purchasedPlan()))->resolve(),
            'flow' => $this->checkoutFlow($request),
            'confirmation' => (bool) $request->session()->get('contract_confirmation'),
        ]);
    }

    /**
     * Confirma el contrato: guarda el cliente y su suscripción,
     * y envía el contrato PDF por correo a la empresa y al cliente.
     */
    public function confirm(
        ConfirmContractRequest $request,
        string $plan,
    ): RedirectResponse {
        $planResult = $this->findActivePlan($plan, 'confirm_contract');

        if ($planResult->unavailable) {
            return back()->withErrors([
                'contract' => $this->unavailableMessage(),
            ]);
        }

        $selectedPlan = $planResult->value;
        assert($selectedPlan instanceof Plan);

        $purchase = $this->paidPurchase($request, $plan);
        $checkout = $purchase ? ['email' => $purchase->email, 'whatsapp' => $purchase->phone, 'subtotal' => $purchase->amount, 'total' => $purchase->amount] : null;

        $hasConfirmedPayment =
            $purchase !== null;

        if (! $hasConfirmedPayment) {
            return redirect()
                ->route('checkout.show', ['plan' => $plan])
                ->with(
                    'error',
                    'Debes confirmar el pago antes de confirmar el contrato.',
                );
        }

        $result = $this->database->run(
            callback: fn (): array => $this->contractService->confirm(
                $request->validated(),
                $purchase->purchasedPlan(),
                $purchase,
            ),
            fallback: null,
            component: 'checkout.contract',
            model: Client::class,
            operation: 'confirm_contract',
        );

        if ($result->unavailable) {
            return back()->withErrors([
                'contract' => $this->unavailableMessage(),
            ]);
        }

        $flow = $this->checkoutFlow($request);

        return redirect()
            ->route('checkout.contract_preview', [
                'plan' => $plan,
                ...($flow === 'renewal' ? ['flow' => 'renewal'] : []),
            ])
            ->with('contract_confirmation', true);
    }

    private function paidPurchase(Request $request, string $slug): ?Purchase
    {
        $purchaseId = $request->session()->get('checkout.purchase_id');
        if (! is_int($purchaseId)) {
            return null;
        }
        $purchase = Purchase::query()->find($purchaseId);
        if (! $purchase || $purchase->product_type !== 'plan' || ($purchase->snapshot['plan']['slug'] ?? null) !== $slug) {
            return null;
        }
        $payment = $purchase->payments()->where('status', Payment::PAID)->first();

        return $payment && $request->session()->get('payment_access.'.$payment->public_id) === true ? $purchase : null;
    }

    private function unavailableMessage(): string
    {
        return 'No fue posible completar la contratación en este momento. Por favor, inténtalo nuevamente.';
    }

    private function checkoutFlow(Request $request): string
    {
        return $request->query('flow') === 'renewal'
            ? 'renewal'
            : 'checkout';
    }

    /** @return DatabaseQueryResult<Plan|null> */
    private function findActivePlan(string $slug, string $operation): DatabaseQueryResult
    {
        return $this->database->run(
            callback: function () use ($slug, $operation): Plan {
                if ($operation !== 'show_checkout' && $operation !== 'validate_checkout_payment') {
                    $purchase = $this->paidPurchase(request(), $slug);
                    if ($purchase) {
                        return $purchase->purchasedPlan();
                    }
                }

                return Plan::query()
                    ->active()
                    ->where('slug', $slug)
                    ->firstOrFail();
            },
            fallback: null,
            component: 'checkout.plan',
            model: Plan::class,
            operation: $operation,
        );
    }

    private function redirectToUnavailableCheckout(string $plan): RedirectResponse
    {
        return redirect()
            ->route('checkout.show', ['plan' => $plan])
            ->with('error', 'No pudimos validar el plan en este momento. Intenta nuevamente más tarde.');
    }
}
