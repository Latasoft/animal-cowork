<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public const ADMIN_ROLES = [
        'super_admin',
        'admin',
        'executive',
        'reception',
    ];

    public const PLAN_MANAGER_ROLES = [
        'super_admin',
        'admin',
    ];

    public const STATUS_ACTIVE = 'active';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $panel->getId() === 'admin'
            && $this->status === self::STATUS_ACTIVE
            && in_array($this->role, self::ADMIN_ROLES, true);
    }

    public function canManagePlans(): bool
    {
        return $this->status === self::STATUS_ACTIVE
            && in_array($this->role, self::PLAN_MANAGER_ROLES, true);
    }

    /** @return HasMany<Reservation, $this> */
    public function createdReservations(): HasMany
    {
        return $this->hasMany(
            Reservation::class,
            'created_by'
        );
    }
}
