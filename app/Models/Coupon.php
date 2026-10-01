<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    public const TYPE_PERCENT = 'percent';

    public const TYPE_FIXED = 'fixed';

    public const TYPES = [
        self::TYPE_PERCENT => 'Porcentaje (%)',
        self::TYPE_FIXED => 'Monto fijo ($)',
    ];

    public const APPLIES_TO = [
        'both' => 'Contratación y renovación',
        'checkout' => 'Solo contratación nueva',
        'renewal' => 'Solo renovación',
    ];

    protected $fillable = [
        'code', 'description', 'discount_type', 'discount_value', 'applies_to',
        'plan_ids', 'starts_at', 'ends_at', 'max_uses', 'used_count', 'is_active',
    ];

    protected $attributes = [
        'applies_to' => 'both',
        'used_count' => 0,
        'is_active' => true,
    ];

    protected function casts(): array
    {
        return [
            'discount_value' => 'integer',
            'plan_ids' => 'array',
            'starts_at' => 'date',
            'ends_at' => 'date',
            'max_uses' => 'integer',
            'used_count' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public static function normalizeCode(?string $code): string
    {
        return strtoupper((string) preg_replace('/\s+/', '', (string) $code));
    }

    /** @return Attribute<string, string> */
    protected function code(): Attribute
    {
        return Attribute::make(set: fn (?string $value): string => self::normalizeCode($value));
    }

    /**
     * Calcula cuánto se descuenta sobre un monto.
     */
    public function discountFor(int $amount): int
    {
        $discount = $this->discount_type === self::TYPE_PERCENT
            ? intdiv($amount * min($this->discount_value, 100), 100)
            : $this->discount_value;

        return max(0, min($discount, $amount));
    }

    public function label(): string
    {
        return $this->discount_type === self::TYPE_PERCENT
            ? $this->discount_value.'%'
            : '$'.number_format($this->discount_value, 0, ',', '.');
    }

    /** @return HasMany<Purchase, $this> */
    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }
}
