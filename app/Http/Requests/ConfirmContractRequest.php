<?php

namespace App\Http\Requests;

use App\Support\ChileanRut;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ConfirmContractRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'contract_type' => ['required', Rule::in(['natural', 'legal'])],

            'email' => ['required', 'string', 'email:rfc', 'max:255'],

            'phone' => ['required', 'string', 'max:30'],

            'representative_name' => ['required', 'string', 'max:255'],

            'representative_rut' => ['required', 'string', 'max:20'],

            'address' => ['required', 'string', 'max:255'],

            'commune' => ['required', 'string', 'max:100'],

            'region' => ['required', 'string', 'max:100'],

            'company_name' => [
                'required_if:contract_type,legal',
                'nullable',
                'string',
                'max:255',
            ],

            'company_rut' => [
                'required_if:contract_type,legal',
                'nullable',
                'string',
                'max:20',
            ],

            'contract_pdf_base64' => [
                'required',
                'string',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    $decoded = base64_decode((string) $value, true);

                    if ($decoded === false || ! str_starts_with($decoded, '%PDF')) {
                        $fail('El contrato debe ser un documento PDF válido.');
                    }
                },
            ],

            'contract_pdf_name' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'contract_type.required' => 'Debes indicar el tipo de contratación.',
            'contract_type.in' => 'El tipo de contratación no es válido.',

            'email.required' => 'Ingresa tu correo electrónico.',
            'email.email' => 'Ingresa un correo electrónico válido.',
            'email.max' => 'El correo electrónico no puede superar los 255 caracteres.',

            'phone.required' => 'Ingresa tu número de WhatsApp.',
            'phone.max' => 'El número de WhatsApp no puede superar los 30 caracteres.',

            'representative_name.required' => 'Debes ingresar el nombre completo.',
            'representative_name.max' => 'El nombre no puede superar los 255 caracteres.',

            'representative_rut.required' => 'Debes ingresar el RUT.',
            'representative_rut.max' => 'El RUT no puede superar los 20 caracteres.',

            'address.required' => 'Debes ingresar la dirección particular.',
            'address.max' => 'La dirección no puede superar los 255 caracteres.',

            'commune.required' => 'Debes ingresar la comuna.',
            'commune.max' => 'La comuna no puede superar los 100 caracteres.',

            'region.required' => 'Debes ingresar la región.',
            'region.max' => 'La región no puede superar los 100 caracteres.',

            'company_name.required_if' => 'Debes ingresar la razón social o nombre de la empresa.',
            'company_name.max' => 'La razón social no puede superar los 255 caracteres.',

            'company_rut.required_if' => 'Debes ingresar el RUT de la empresa.',
            'company_rut.max' => 'El RUT de la empresa no puede superar los 20 caracteres.',

            'contract_pdf_base64.required' => 'No fue posible generar el contrato. Vuelve a intentarlo.',

            'contract_pdf_name.required' => 'No fue posible generar el contrato. Vuelve a intentarlo.',
            'contract_pdf_name.max' => 'El nombre del contrato es demasiado largo.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $normalized = [];

        if ($this->filled('representative_rut')) {
            $normalized['representative_rut'] = ChileanRut::normalize(
                $this->string('representative_rut')->toString()
            );
        }

        if ($this->filled('company_rut')) {
            $normalized['company_rut'] = ChileanRut::normalize(
                $this->string('company_rut')->toString()
            );
        }

        $this->merge($normalized);
    }
}
