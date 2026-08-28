<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
}