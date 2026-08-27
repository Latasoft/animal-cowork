<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class PrivateOffice extends Model
{
    use HasUlids;

    protected $fillable = [
        'name',
        'slug',
        'image',
        'image_alt',
        'area_m2',
        'is_available',
        'price',
        'currency',
        'expenses_included',
        'features',
        'sort_order',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'area_m2' => 'decimal:2',
            'price' => 'decimal:2',
            'is_available' => 'boolean',
            'expenses_included' => 'boolean',
            'features' => 'array',
            'sort_order' => 'integer',
            'is_visible' => 'boolean',
        ];
    }
}