<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

    protected $appends = [
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'service_price' => 'integer',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * URL pública de la imagen.
     *
     * Soporta:
     * - Imágenes antiguas almacenadas directamente en public/images/...
     * - Imágenes nuevas almacenadas en storage/app/public/services/...
     */
    public function getImageUrlAttribute(): ?string
    {
        if (blank($this->image)) {
            return null;
        }

        /*
         * Imagen antigua/bundled:
         *
         * Ejemplo:
         * /images/gestion-patente-comercial.webp
         */
        if (Str::startsWith($this->image, '/')) {
            return url($this->image);
        }

        /*
         * Imagen nueva subida desde Filament:
         *
         * Ejemplo:
         * services/01M14FTQCF622HVP3BRX2VFZA5.jpg
         */
        return Storage::disk('public')->url($this->image);
    }

    /**
     * Scope para obtener únicamente servicios activos.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope para ordenar servicios.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query
            ->orderBy('sort_order')
            ->orderBy('id');
    }
}