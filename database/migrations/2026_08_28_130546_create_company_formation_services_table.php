<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_formation_services', function (Blueprint $table) {
            $table->id();

            /*
             * Identificación
             */
            $table->string('slug')->unique();

            /*
             * Contenido principal
             */
            $table->string('eyebrow')->nullable();
            $table->string('title');
            $table->text('description');

            /*
             * Servicio externo:
             * Constitución de Empresa + Inicio de Actividades
             */
            $table->string('external_service_label')->nullable();
            $table->string('external_service_title')->nullable();
            $table->unsignedInteger('external_service_price')->nullable();
            $table->text('external_service_description')->nullable();

            /*
             * Oficina Virtual
             */
            $table->string('virtual_office_label')->nullable();
            $table->string('virtual_office_title')->nullable();
            $table->unsignedInteger('virtual_office_price')->nullable();
            $table->string('virtual_office_duration')->nullable();

            /*
             * Requisitos y descripción del servicio
             */
            $table->string('service_section_eyebrow')->nullable();
            $table->string('service_section_title')->nullable();
            $table->text('service_section_description')->nullable();

            $table->json('requirements')->nullable();

            $table->text('foreigner_notice')->nullable();

            /*
             * Servicios incluidos
             */
            $table->string('included_services_title')->nullable();
            $table->json('included_services')->nullable();

            /*
             * Contacto
             */
            $table->string('contact_title')->nullable();
            $table->text('contact_description')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_whatsapp')->nullable();

            /*
             * Imagen
             */
            $table->string('image')->nullable();
            $table->string('image_alt')->nullable();

            /*
             * CTA principal
             */
            $table->string('primary_action_label')->nullable();
            $table->string('primary_action_href')->nullable();

            /*
             * Publicación
             */
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_formation_services');
    }
};