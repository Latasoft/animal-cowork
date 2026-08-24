<?php

namespace App\Models;

use Database\Factories\PlanFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $slug
 * @property string $name
 * @property string|null $image_path
 * @property-read int $total_price
 * @property-read string $image_url
 * @property-read string $fallback_image_url
 */
class Plan extends Model
{
    /** @use HasFactory<PlanFactory> */
    use HasFactory, SoftDeletes;

    public const THEMES = [
        'green' => 'Verde',
        'orange' => 'Naranjo',
        'gold' => 'Dorado',
    ];

    protected $fillable = [
        'slug',
        'name',
        'badge',

        'price_office',
        'price_additional',

        'contract_duration_months',

        'features',

        'includes_room_access',
        'monthly_room_minutes_included',
        'room_minutes_rollover',
        'extra_room_hour_price_net',
        'extra_room_hour_taxable',

        'image_path',
        'image_alt',
        'theme',

        'is_featured',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price_office' => 'integer',
            'price_additional' => 'integer',

            'contract_duration_months' => 'integer',

            'features' => 'array',

            'includes_room_access' => 'boolean',
            'monthly_room_minutes_included' => 'integer',
            'room_minutes_rollover' => 'boolean',
            'extra_room_hour_price_net' => 'integer',
            'extra_room_hour_taxable' => 'boolean',

            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::updated(function (Plan $plan): void {
            $originalImagePath = $plan->getOriginal('image_path');

            if ($originalImagePath !== $plan->image_path) {
                self::deleteUploadedImage($originalImagePath);
            }
        });

        static::forceDeleted(function (Plan $plan): void {
            self::deleteUploadedImage($plan->image_path);
        });
    }

    private static function deleteUploadedImage(mixed $imagePath): void
    {
        if (! is_string($imagePath) || blank($imagePath) || Str::startsWith($imagePath, '/')) {
            return;
        }

        Storage::disk('public')->delete($imagePath);
    }

    public function getTotalPriceAttribute(): int
    {
        return $this->price_office + $this->price_additional;
    }

    public function getImageUrlAttribute(): string
    {
        if (blank($this->image_path)) {
            return url($this->fallback_image_url);
        }

        if (Str::startsWith($this->image_path, '/')) {
            return url($this->image_path);
        }

        return Storage::disk('public')->url($this->image_path);
    }

    public function getFallbackImageUrlAttribute(): string
    {
        $planImagePath = public_path("images/plans/{$this->slug}.webp");

        return is_file($planImagePath)
            ? "/images/plans/{$this->slug}.webp"
            : '/images/plans/placeholder.svg';
    }

    /**
     * @param  Builder<Plan>  $query
     * @return Builder<Plan>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<Plan>  $query
     * @return Builder<Plan>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    /** @return HasMany<Subscription, $this> */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
}
