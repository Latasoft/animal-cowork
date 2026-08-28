<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property string|null $image
 * @property-read string|null $image_url
 */
class PatentManagementService extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug',
        'eyebrow',
        'title',
        'description',

        'service_section_title',
        'service_section_description',

        'legal_notice',

        'service_price',
        'currency',

        'municipal_payment_detail',
        'exclusive_notice',

        'image',
        'image_alt',

        'primary_action_label',
        'primary_action_href',

        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'service_price' => 'integer',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::updated(function (PatentManagementService $service): void {
            $originalImagePath = $service->getOriginal('image');

            if ($originalImagePath !== $service->image) {
                self::deleteUploadedImage($originalImagePath);
            }
        });

        static::forceDeleted(function (PatentManagementService $service): void {
            self::deleteUploadedImage($service->image);
        });
    }

    private static function deleteUploadedImage(mixed $imagePath): void
    {
        if (
            ! is_string($imagePath)
            || blank($imagePath)
            || Str::startsWith($imagePath, '/')
        ) {
            return;
        }

        Storage::disk('public')->delete($imagePath);
    }

    public function getImageUrlAttribute(): ?string
    {
        if (blank($this->image)) {
            return null;
        }

        // Imagen antigua ubicada directamente en public/images/...
        if (Str::startsWith($this->image, '/')) {
            return url($this->image);
        }

        // Imagen subida mediante Filament a storage/app/public/...
        return Storage::disk('public')->url($this->image);
    }
}