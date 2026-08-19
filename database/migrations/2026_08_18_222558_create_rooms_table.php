<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Identificación
            |--------------------------------------------------------------------------
            */
            $table->string('slug', 50)->unique();
            $table->string('name', 100);
            $table->string('short_name', 50);

            /*
            |--------------------------------------------------------------------------
            | Información
            |--------------------------------------------------------------------------
            */
            $table->text('description')->nullable();

            // Capacidad máxima de personas.
            $table->unsignedSmallInteger('capacity');

            $table->string('location', 255)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Multimedia
            |--------------------------------------------------------------------------
            */
            $table->json('images');
            $table->string('image_alt', 255)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Características
            |--------------------------------------------------------------------------
            */
            $table->json('features');

            /*
            |--------------------------------------------------------------------------
            | Precio para público general
            |--------------------------------------------------------------------------
            |
            | Valor NETO.
            | Tarifa pública actual: $20.000 + IVA.
            |
            */
            $table->unsignedInteger('normal_hour_price_net')
                ->default(20000);

            $table->boolean('normal_hour_taxable')
                ->default(true);

            /*
            |--------------------------------------------------------------------------
            | Bloques reservables
            |--------------------------------------------------------------------------
            |
            | Ejemplo:
            |
            | [
            |   {
            |       "id": "10-11",
            |       "start": "10:00",
            |       "end": "11:10"
            |   }
            | ]
            |
            */
            $table->json('time_slots');

            /*
            |--------------------------------------------------------------------------
            | Estado
            |--------------------------------------------------------------------------
            */
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
        Schema::dropIfExists('rooms');
    }
};
