<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Relaciones
            |--------------------------------------------------------------------------
            */
            $table->foreignId('client_id')
                ->constrained('clients')
                ->restrictOnDelete();

            $table->foreignId('plan_id')
                ->constrained('plans')
                ->restrictOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Vigencia
            |--------------------------------------------------------------------------
            */
            $table->date('starts_at');
            $table->date('ends_at');

            /*
            |--------------------------------------------------------------------------
            | Estado
            |--------------------------------------------------------------------------
            |
            | pending   = creada pero todavía no vigente
            | active    = actualmente vigente
            | expired   = terminó su vigencia
            | cancelled = cancelada
            |
            */
            $table->string('status', 20)->default('pending');

            /*
            |--------------------------------------------------------------------------
            | Snapshot económico
            |--------------------------------------------------------------------------
            |
            | Estos valores representan lo que efectivamente contrató el cliente.
            | Si el precio de plans cambia en el futuro, esta suscripción conserva
            | las condiciones originales.
            |
            */
            $table->unsignedInteger('price_office');
            $table->unsignedInteger('price_additional')->default(0);

            /*
            |--------------------------------------------------------------------------
            | Snapshot beneficio sala
            |--------------------------------------------------------------------------
            |
            | El beneficio actual es de 120 minutos mensuales.
            | No son acumulables.
            | Hora adicional: $7.000 netos + IVA.
            |
            | Se copian desde el plan al contratar para preservar las condiciones
            | históricas del cliente.
            |
            */
            $table->boolean('includes_room_access')->default(false);

            $table->unsignedSmallInteger('monthly_room_minutes_included')
                ->default(0);

            $table->boolean('room_minutes_rollover')
                ->default(false);

            $table->unsignedInteger('extra_room_hour_price_net')
                ->nullable();

            $table->boolean('extra_room_hour_taxable')
                ->default(true);

            /*
            |--------------------------------------------------------------------------
            | Renovación
            |--------------------------------------------------------------------------
            |
            | Si esta suscripción nació de una renovación, apunta a la anterior.
            |
            */
            $table->foreignId('previous_subscription_id')
                ->nullable()
                ->constrained('subscriptions')
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Información administrativa
            |--------------------------------------------------------------------------
            */
            $table->text('notes')->nullable();

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Índices
            |--------------------------------------------------------------------------
            */
            $table->index(['client_id', 'status']);
            $table->index(['plan_id', 'status']);
            $table->index('starts_at');
            $table->index('ends_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};