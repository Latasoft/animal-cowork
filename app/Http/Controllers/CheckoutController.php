<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanResource;
use App\Models\Plan;
use App\Support\DatabaseQueryResult;
use App\Support\SafeDatabaseQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(private SafeDatabaseQuery $database) {}

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
     * Temporalmente simula el pago como confirmado y redirige
     * al Paso 2. Más adelante aquí se conectará la pasarela.
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

        /*
         * El precio se obtiene siempre desde Laravel.
         * Nunca se utiliza un precio enviado desde React.
         */
        $subtotal = $selectedPlan->total_price;
        $flow = $this->checkoutFlow($request);

        /*
         * El cupón todavía no aplica descuentos reales.
         * Más adelante se validará desde la base de datos.
         */
        $discountCode = $validated['discount_code'] ?? null;
        $discountAmount = 0;
        $total = $subtotal - $discountAmount;

        /*
         * Simulación temporal del pago confirmado.
         *
         * Cuando se integre la pasarela:
         *
         * 1. Crear una orden pendiente.
         * 2. Validar y aplicar el cupón.
         * 3. Crear la transacción en la pasarela.
         * 4. Redirigir al cliente hacia el pago.
         * 5. Confirmar mediante webhook o retorno seguro.
         * 6. Permitir el acceso al Paso 2.
         */
        $request->session()->put('checkout', [
            'plan_id' => $selectedPlan->slug,
            'email' => $validated['representative_email'],
            'whatsapp' => $validated['representative_whatsapp'],
            'discount_code' => $discountCode,
            'subtotal' => $subtotal,
            'discount_amount' => $discountAmount,
            'total' => $total,

            // Temporal para desarrollo.
            'payment_confirmed' => true,
        ]);

        return redirect()->route('checkout.data', [
            'plan' => $plan,
            ...($flow === 'renewal' ? ['flow' => 'renewal'] : []),
        ]);
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

        $checkout = $request->session()->get('checkout');

        $hasConfirmedPayment =
            is_array($checkout) &&
            ($checkout['plan_id'] ?? null) === $plan &&
            ($checkout['payment_confirmed'] ?? false) === true;

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
            'plan' => (new PlanResource($selectedPlan))->resolve(),
            'flow' => $this->checkoutFlow($request),

            'customer' => [
                'email' => $checkout['email'] ?? '',
                'whatsapp' => $checkout['whatsapp'] ?? '',
            ],

            'payment' => [
                'subtotal' => $checkout['subtotal'] ?? 0,
                'discountCode' => $checkout['discount_code'] ?? null,
                'discountAmount' => $checkout['discount_amount'] ?? 0,
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

        $checkout = $request->session()->get('checkout');

        $hasConfirmedPayment =
            is_array($checkout) &&
            ($checkout['plan_id'] ?? null) === $plan &&
            ($checkout['payment_confirmed'] ?? false) === true;

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
            'plan' => (new PlanResource($selectedPlan))->resolve(),
        ]);
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
            callback: fn (): Plan => Plan::query()
                ->active()
                ->where('slug', $slug)
                ->firstOrFail(),
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
