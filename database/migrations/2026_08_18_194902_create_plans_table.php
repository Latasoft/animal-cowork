<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();

            // Identificación
            $table->string('slug', 50)->unique();
            $table->string('name', 100);
            $table->string('badge', 100)->nullable();

            // Precios
            $table->unsignedInteger('price_office');
            $table->unsignedInteger('price_additional')->default(0);

            // Duración del contrato
            $table->unsignedSmallInteger('contract_duration_months');

            // Características visibles del plan
            $table->json('features');

            // Beneficio de sala de reuniones
            $table->boolean('includes_room_access')->default(false);

            // Minutos gratuitos mensuales
            $table->unsignedSmallInteger('monthly_room_minutes_included')
                ->default(0);

            // Las horas gratuitas no son acumulables
            $table->boolean('room_minutes_rollover')
                ->default(false);

            // Precio neto por hora adicional
            $table->unsignedInteger('extra_room_hour_price_net')
                ->nullable();

            // Indica si al valor adicional se le debe agregar IVA
            $table->boolean('extra_room_hour_taxable')
                ->default(true);

            // Presentación
            $table->string('image_path')->nullable();
            $table->string('image_alt')->nullable();
            $table->string('theme', 30)->nullable();

            // Estado y orden
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->index('is_active');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};