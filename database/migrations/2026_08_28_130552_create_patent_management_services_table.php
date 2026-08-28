<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patent_management_services', function (Blueprint $table) {
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
             * Sección del servicio
             */
            $table->string('service_section_title')->nullable();
            $table->text('service_section_description')->nullable();

            /*
             * Información legal
             */
            $table->text('legal_notice')->nullable();

            /*
             * Precio
             */
            $table->unsignedInteger('service_price')->nullable();
            $table->string('currency', 3)->default('CLP');

            /*
             * Información sobre el pago municipal
             */
            $table->text('municipal_payment_detail')->nullable();

            /*
             * Aviso comercial
             */
            $table->text('exclusive_notice')->nullable();

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
        Schema::dropIfExists('patent_management_services');
    }
};