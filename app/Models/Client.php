<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $status
 * @property string $company_name
 * @property string $company_rut
 */
class Client extends Model
{
    use SoftDeletes;

    public const STATUS_ACTIVE = 'active';

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

    /** @return HasMany<Subscription, $this> */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /** @return HasMany<Reservation, $this> */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
