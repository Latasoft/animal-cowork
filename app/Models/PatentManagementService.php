<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
}