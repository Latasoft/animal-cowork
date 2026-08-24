<?php

namespace App\Support;

/** @template-covariant TValue */
final readonly class DatabaseQueryResult
{
    /** @param TValue $value */
    private function __construct(
        public mixed $value,
        public bool $unavailable,
    ) {}

    /**
     * @template TResult
     *
     * @param  TResult  $value
     * @return self<TResult>
     */
    public static function available(mixed $value): self
    {
        return new self($value, false);
    }

    /**
     * @template TResult
     *
     * @param  TResult  $fallback
     * @return self<TResult>
     */
    public static function unavailable(mixed $fallback): self
    {
        return new self($fallback, true);
    }
}
