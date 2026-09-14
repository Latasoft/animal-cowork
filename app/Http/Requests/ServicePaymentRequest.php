<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServicePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (! is_string($this->input('email')) || ! is_string($this->input('phone'))) {
            return;
        }
        $digits = preg_replace('/\\D/', '', (string) $this->input('phone'));
        $this->merge(['email' => mb_strtolower(trim((string) $this->input('email'))), 'phone' => '+'.(strlen($digits) === 9 ? '56' : '').$digits]);
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return ['email' => ['required', 'string', 'email:rfc', 'max:150'], 'phone' => ['required', 'string', 'regex:/^\\+569[0-9]{8}$/']];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return ['email.required' => 'Ingresa tu correo electrónico.', 'email.email' => 'Ingresa un correo válido.',
            'phone.regex' => 'Ingresa un WhatsApp chileno válido, por ejemplo +56 9 1234 5678.'];
    }
}
