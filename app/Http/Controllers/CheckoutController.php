<?php

namespace App\Http\Controllers;

use App\Rules\ValidChileanRut;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function show(string $plan)
    {
        $plans = $this->plans();

        abort_unless(isset($plans[$plan]), 404);

        return Inertia::render('checkout', [
            'plan' => $plans[$plan],
        ]);
    }

    public function store(Request $request)
    {
        $plans = $this->plans();

        $validated = $request->validate([
            'plan_id' => [
                'required',
                'string',
                Rule::in(array_keys($plans)),
            ],

            'representative_name' => [
                'required',
                'string',
                'min:5',
                'max:120',
                "regex:/^[\pL\s.'-]+$/u",
            ],

            'representative_rut' => [
                'required',
                'string',
                'max:12',
                new ValidChileanRut(),
            ],

            'company_name' => [
                'required',
                'string',
                'min:2',
                'max:160',
            ],

            'company_rut' => [
                'required',
                'string',
                'max:12',
                new ValidChileanRut(),
            ],

            'representative_address' => [
                'required',
                'string',
                'min:8',
                'max:200',
            ],

            'representative_email' => [
                'required',
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

                    if (!preg_match('/^(?:56)?9\d{8}$/', $digits)) {
                        $fail(
                            'Ingresa un número de WhatsApp chileno válido.',
                        );
                    }
                },
            ],

            'accept_terms' => [
                'accepted',
            ],
        ], [
            'plan_id.required' =>
                'Debes seleccionar un plan.',
            'plan_id.in' =>
                'El plan seleccionado no es válido.',

            'representative_name.required' =>
                'Ingresa el nombre completo del representante legal.',
            'representative_name.min' =>
                'El nombre completo debe tener al menos 5 caracteres.',
            'representative_name.max' =>
                'El nombre completo no puede superar los 120 caracteres.',
            'representative_name.regex' =>
                'El nombre contiene caracteres no permitidos.',

            'representative_rut.required' =>
                'Ingresa el RUT del representante legal.',

            'company_name.required' =>
                'Ingresa la razón social o nombre de la empresa.',
            'company_name.min' =>
                'La razón social debe tener al menos 2 caracteres.',

            'company_rut.required' =>
                'Ingresa el RUT de la empresa.',

            'representative_address.required' =>
                'Ingresa la dirección particular del representante legal.',
            'representative_address.min' =>
                'Ingresa una dirección más completa.',

            'representative_email.required' =>
                'Ingresa el correo electrónico del representante legal.',
            'representative_email.email' =>
                'Ingresa un correo electrónico válido.',

            'representative_whatsapp.required' =>
                'Ingresa el número de WhatsApp del representante legal.',

            'accept_terms.accepted' =>
                'Debes aceptar los términos y condiciones para continuar.',
        ]);

        $selectedPlan = $plans[$validated['plan_id']];

        // El precio siempre debe obtenerse desde Laravel.
        $total = $selectedPlan['price'];

        // Próximo paso:
        // guardar solicitud, generar contrato y crear transacción de pago.

        return back()->with(
            'success',
            'Los datos fueron validados correctamente.',
        );
    }

    private function plans(): array
    {
        return [
            'fenix' => [
                'id' => 'fenix',
                'name' => 'Plan Fénix',
                'tagline' => 'Oficina virtual por 2 años',
                'price' => 59990,
                'duration' => '2 años',
                'image' => '/images/plans/fenix.webp',
                'imageAlt' => 'Ilustración del Plan Fénix',
            ],

            'lobo' => [
                'id' => 'lobo',
                'name' => 'Plan Lobo',
                'tagline' =>
                    'Oficina virtual y gestión de patente comercial',
                'price' => 89990,
                'duration' => '1 año',
                'image' => '/images/plans/lobo.webp',
                'imageAlt' => 'Ilustración del Plan Lobo',
            ],

            'leon' => [
                'id' => 'leon',
                'name' => 'Plan León',
                'tagline' => 'Oficina virtual por 2 años',
                'price' => 98000,
                'duration' => '2 años',
                'image' => '/images/plans/leon.webp',
                'imageAlt' => 'Ilustración del Plan León',
            ],
        ];
    }
}