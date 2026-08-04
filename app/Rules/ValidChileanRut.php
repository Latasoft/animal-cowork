<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidChileanRut implements ValidationRule
{
    public function validate(
        string $attribute,
        mixed $value,
        Closure $fail,
    ): void {
        $rut = strtoupper(
            preg_replace('/[^0-9K]/', '', (string) $value)
        );

        if (strlen($rut) < 8 || strlen($rut) > 9) {
            $fail('El :attribute no es válido.');

            return;
        }

        $body = substr($rut, 0, -1);
        $providedDigit = substr($rut, -1);

        if (!ctype_digit($body)) {
            $fail('El :attribute no es válido.');

            return;
        }

        $sum = 0;
        $multiplier = 2;

        for ($index = strlen($body) - 1; $index >= 0; $index--) {
            $sum += ((int) $body[$index]) * $multiplier;

            $multiplier = $multiplier === 7
                ? 2
                : $multiplier + 1;
        }

        $result = 11 - ($sum % 11);

        $expectedDigit = match ($result) {
            11 => '0',
            10 => 'K',
            default => (string) $result,
        };

        if ($providedDigit !== $expectedDigit) {
            $fail('El :attribute no es válido.');
        }
    }
}