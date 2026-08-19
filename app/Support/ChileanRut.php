<?php

namespace App\Support;

class ChileanRut
{
    public static function compact(string $rut): string
    {
        return mb_strtoupper((string) preg_replace('/[^0-9kK]/', '', $rut));
    }

    public static function normalize(string $rut): string
    {
        $cleanRut = self::compact($rut);

        if (mb_strlen($cleanRut) < 2) {
            return $cleanRut;
        }

        $body = ltrim(mb_substr($cleanRut, 0, -1), '0');
        $verificationDigit = mb_substr($cleanRut, -1);

        return ($body === '' ? '0' : $body).'-'.$verificationDigit;
    }

    /** @return list<string> */
    public static function databaseVariants(string $rut): array
    {
        $normalizedRut = self::normalize($rut);

        if (! preg_match('/^(\d+)-([0-9K])$/', $normalizedRut, $matches)) {
            return [$normalizedRut];
        }

        $body = $matches[1];
        $verificationDigit = $matches[2];
        $formattedBody = (string) preg_replace('/\B(?=(\d{3})+(?!\d))/', '.', $body);
        $variants = [
            $normalizedRut,
            $body.$verificationDigit,
            $formattedBody.'-'.$verificationDigit,
            $formattedBody.$verificationDigit,
        ];

        if ($verificationDigit === 'K') {
            $variants = [
                ...$variants,
                ...array_map(mb_strtolower(...), $variants),
            ];
        }

        return array_values(array_unique($variants));
    }

    public static function isValid(string $rut): bool
    {
        $normalizedRut = self::normalize($rut);

        if (! preg_match('/^(\d{1,8})-([0-9K])$/', $normalizedRut, $matches)) {
            return false;
        }

        $body = $matches[1];
        $sum = 0;
        $factor = 2;

        for ($index = mb_strlen($body) - 1; $index >= 0; $index--) {
            $sum += ((int) $body[$index]) * $factor;
            $factor = $factor === 7 ? 2 : $factor + 1;
        }

        $remainder = 11 - ($sum % 11);
        $expectedVerificationDigit = match ($remainder) {
            11 => '0',
            10 => 'K',
            default => (string) $remainder,
        };

        return $matches[2] === $expectedVerificationDigit;
    }
}
