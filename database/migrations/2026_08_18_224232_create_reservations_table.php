<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Relaciones
            |--------------------------------------------------------------------------
            */

            $table->foreignId('room_id')
                ->constrained('rooms')
                ->restrictOnDelete();

            /*
            | Puede ser null porque más adelante podríamos permitir
            | reservas de personas que no sean clientes vigentes.
            */
            $table->foreignId('client_id')
                ->nullable()
                ->constrained('clients')
                ->nullOnDelete();

            /*
            | Suscripción utilizada para obtener el beneficio de cliente.
            | Puede ser null para público general.
            */
            $table->foreignId('subscription_id')
                ->nullable()
                ->constrained('subscriptions')
                ->nullOnDelete();

            /*
            | Usuario administrativo que creó la reserva manualmente.
            | Null si la reserva se hizo desde la web.
            */
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Datos del contacto de la reserva
            |--------------------------------------------------------------------------
            |
            | Se guardan como snapshot porque el cliente puede cambiar
            | su correo o teléfono posteriormente.
            |
            */
            $table->string('contact_name', 255);
            $table->string('contact_email', 255);
            $table->string('contact_phone', 30);

            /*
            |--------------------------------------------------------------------------
            | Fecha y hora
            |--------------------------------------------------------------------------
            */
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');

            /*
            |--------------------------------------------------------------------------
            | Duración
            |--------------------------------------------------------------------------
            |
            | Se guarda para facilitar cálculos e historial.
            |
            */
            $table->unsignedSmallInteger('duration_minutes');

            /*
            |--------------------------------------------------------------------------
            | Tipo de tarifa
            |--------------------------------------------------------------------------
            |
            | client = cliente con suscripción vigente
            | public = público general
            |
            */
            $table->string('rate_type', 20);

            /*
            |--------------------------------------------------------------------------
            | Beneficio mensual utilizado
            |--------------------------------------------------------------------------
            */
            $table->unsignedSmallInteger('included_minutes_used')
                ->default(0);

            $table->unsignedSmallInteger('billable_minutes')
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Snapshot económico
            |--------------------------------------------------------------------------
            |
            | rate_per_hour_net representa la tarifa aplicable:
            |
            | cliente: $7.000
            | público: $12.000
            |
            */
            $table->unsignedInteger('rate_per_hour_net')
                ->default(0);

            $table->decimal('tax_rate', 5, 4)
                ->default(0.1900);

            $table->unsignedInteger('subtotal_net')
                ->default(0);

            $table->unsignedInteger('tax_amount')
                ->default(0);

            $table->unsignedInteger('total_amount')
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Pago
            |--------------------------------------------------------------------------
            |
            | unpaid
            | pending
            | paid
            | waived
            |
            | waived será útil cuando toda la reserva esté cubierta
            | por horas gratuitas.
            |
            */
            $table->string('payment_status', 20)
                ->default('unpaid');

            $table->timestamp('paid_at')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Estado de reserva
            |--------------------------------------------------------------------------
            |
            | pending
            | confirmed
            | completed
            | cancelled
            | no_show
            |
            */
            $table->string('status', 20)
                ->default('pending');

            $table->timestamp('confirmed_at')
                ->nullable();

            $table->timestamp('cancelled_at')
                ->nullable();

            $table->text('cancellation_reason')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Términos de reserva
            |--------------------------------------------------------------------------
            */
            $table->timestamp('terms_accepted_at')
                ->nullable();

            $table->string('terms_version', 50)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Información adicional
            |--------------------------------------------------------------------------
            */
            $table->text('notes')->nullable();

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Índices
            |--------------------------------------------------------------------------
            */
            $table->index(['room_id', 'starts_at', 'ends_at']);
            $table->index(['client_id', 'starts_at']);
            $table->index(['subscription_id', 'starts_at']);
            $table->index('status');
            $table->index('payment_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};