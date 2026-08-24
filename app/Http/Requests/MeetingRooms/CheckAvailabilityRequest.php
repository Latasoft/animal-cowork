<?php

namespace App\Http\Requests\MeetingRooms;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CheckAvailabilityRequest extends FormRequest
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
            'room' => [
                'required',
                'string',
                'max:50',
            ],
            'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'room.exists' => 'La sala seleccionada no está disponible.',
            'date.date_format' => 'La fecha seleccionada no es válida.',
            'date.after_or_equal' => 'La fecha seleccionada ya pasó.',
        ];
    }
}
