<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CompanyFormationService extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug',
        'eyebrow',
        'title',
        'description',

        'external_service_label',
        'external_service_title',
        'external_service_price',
        'external_service_description',

        'virtual_office_label',
        'virtual_office_title',
        'virtual_office_price',
        'virtual_office_duration',

        'service_section_eyebrow',
        'service_section_title',
        'service_section_description',
        'requirements',
        'foreigner_notice',

        'included_services_title',
        'included_services',

        'contact_title',
        'contact_description',
        'contact_email',
        'contact_whatsapp',

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
            'external_service_price' => 'integer',
            'virtual_office_price' => 'integer',

            'requirements' => 'array',
            'included_services' => 'array',

            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function getImageUrlAttribute(): ?string
    {
        if (blank($this->image)) {
            return null;
        }

        /*
         * Imagen antigua incluida directamente
         * dentro de public/
         *
         * Ejemplo:
         * /images/company-formation/empresa.webp
         */
        if (Str::startsWith($this->image, '/')) {
            return url($this->image);
        }

        /*
         * Imagen subida desde Filament.
         *
         * Ejemplo:
         * company-formation/01M....jpg
         */
        return Storage::disk('public')->url($this->image);
    }
}