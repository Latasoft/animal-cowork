<?php

namespace App\Http\Requests\MeetingRooms;

use App\Support\ChileanRut;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReservationRequest extends FormRequest
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
            'customer_type' => ['required', Rule::in(['plan', 'external'])],
            'room' => [
                'required',
                'string',
                'max:50',
            ],
            'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'slot_ids' => ['required', 'array', 'min:1'],
            'slot_ids.*' => ['required', 'string', 'distinct'],
            'company_rut' => [
                'required',
                'string',
                'max:20',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (! ChileanRut::isValid((string) $value)) {
                        $fail('Ingresa un RUT de empresa válido.');
                    }
                },
            ],
            'company_name' => ['required', 'string', 'max:255'],
            'representative_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'phone' => ['required', 'string', 'max:30', 'regex:/^[+0-9()\s-]{8,30}$/'],
            'contract_type' => ['nullable', Rule::in(['natural', 'legal'])],
            'representative_rut' => [
                'nullable',
                'string',
                'max:20',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if ($value !== null && $value !== '' && ! ChileanRut::isValid((string) $value)) {
                        $fail('Ingresa un RUT de representante válido.');
                    }
                },
            ],
            'address' => ['nullable', 'string', 'max:255'],
            'commune' => ['nullable', 'string', 'max:100'],
            'region' => ['nullable', 'string', 'max:100'],
            'accepts_terms' => ['nullable', 'boolean'],
            'accepts_privacy' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'room.exists' => 'La sala seleccionada no está disponible.',
            'phone.regex' => 'Ingresa un número de contacto válido.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $normalized = [];

        if ($this->has('company_rut')) {
            $normalized['company_rut'] = ChileanRut::normalize($this->string('company_rut')->toString());
        }

        if ($this->filled('representative_rut')) {
            $normalized['representative_rut'] = ChileanRut::normalize($this->string('representative_rut')->toString());
        }

        $this->merge($normalized);
    }
}
