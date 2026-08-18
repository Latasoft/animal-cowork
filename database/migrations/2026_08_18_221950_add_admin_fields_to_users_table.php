<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            /*
            |--------------------------------------------------------------------------
            | Rol dentro del sistema
            |--------------------------------------------------------------------------
            |
            | super_admin
            | admin
            | executive
            | reception
            |
            */
            $table->string('role', 30)
                ->default('executive')
                ->after('password');

            /*
            |--------------------------------------------------------------------------
            | Estado de acceso
            |--------------------------------------------------------------------------
            |
            | active
            | inactive
            |
            */
            $table->string('status', 20)
                ->default('active')
                ->after('role');

            /*
            |--------------------------------------------------------------------------
            | Auditoría básica
            |--------------------------------------------------------------------------
            */
            $table->timestamp('last_login_at')
                ->nullable()
                ->after('status');

            $table->index(['role', 'status']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role', 'status']);

            $table->dropColumn([
                'role',
                'status',
                'last_login_at',
            ]);
        });
    }
};