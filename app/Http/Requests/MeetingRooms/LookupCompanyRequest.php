<?php

namespace App\Http\Requests\MeetingRooms;

use App\Support\ChileanRut;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LookupCompanyRequest extends FormRequest
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
            'company_rut' => [
                'required_if:customer_type,plan',
                'nullable',
                'string',
                'max:20',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (! ChileanRut::isValid((string) $value)) {
                        $fail('Ingresa un RUT de empresa válido.');
                    }
                },
            ],
            'room' => [
                'required',
                'string',
                Rule::exists('rooms', 'slug')->where(fn ($query) => $query
                    ->where('is_active', true)
                    ->whereNull('deleted_at')),
            ],
            'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'slot_ids' => ['required', 'array', 'min:1'],
            'slot_ids.*' => ['required', 'string', 'distinct'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('company_rut')) {
            $this->merge([
                'company_rut' => ChileanRut::normalize($this->string('company_rut')->toString()),
            ]);
        }
    }
}
