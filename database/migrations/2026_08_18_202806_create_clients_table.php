<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Tipo de contratación
            |--------------------------------------------------------------------------
            |
            | natural = persona natural con giro
            | legal   = persona jurídica
            |
            | Lo mantenemos como string y validamos los valores desde Laravel.
            |
            */
            $table->string('contract_type', 20);

            /*
            |--------------------------------------------------------------------------
            | Contacto
            |--------------------------------------------------------------------------
            */
            $table->string('email', 255);
            $table->string('phone', 30);

            /*
            |--------------------------------------------------------------------------
            | Representante legal / contratante
            |--------------------------------------------------------------------------
            */
            $table->string('representative_name', 255);
            $table->string('representative_rut', 20);

            /*
            |--------------------------------------------------------------------------
            | Domicilio incorporado al contrato
            |--------------------------------------------------------------------------
            */
            $table->string('address', 255);
            $table->string('commune', 100);
            $table->string('region', 100);

            /*
            |--------------------------------------------------------------------------
            | Empresa / persona natural con giro
            |--------------------------------------------------------------------------
            */
            $table->string('company_name', 255);
            $table->string('company_rut', 20)->unique();

            /*
            |--------------------------------------------------------------------------
            | Estado administrativo
            |--------------------------------------------------------------------------
            |
            | Este estado NO indica si la oficina virtual está vigente.
            | La vigencia dependerá posteriormente de subscriptions.
            |
            */
            $table->string('status', 20)->default('active');

            /*
            |--------------------------------------------------------------------------
            | Información administrativa
            |--------------------------------------------------------------------------
            */
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            /*
            |--------------------------------------------------------------------------
            | Índices
            |--------------------------------------------------------------------------
            */
            $table->index('representative_rut');
            $table->index('email');
            $table->index('phone');
            $table->index('status');
            $table->index('contract_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};