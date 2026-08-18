<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'contract_type',

        'email',
        'phone',

        'representative_name',
        'representative_rut',

        'address',
        'commune',
        'region',

        'company_name',
        'company_rut',

        'status',
        'notes',
    ];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}