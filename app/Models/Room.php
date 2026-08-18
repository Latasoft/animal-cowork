<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug',
        'name',
        'short_name',

        'description',
        'capacity',
        'location',

        'images',
        'image_alt',
        'features',

        'normal_hour_price_net',
        'normal_hour_taxable',

        'time_slots',

        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'capacity' => 'integer',

            'images' => 'array',
            'features' => 'array',
            'time_slots' => 'array',

            'normal_hour_price_net' => 'integer',
            'normal_hour_taxable' => 'boolean',

            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
    
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}