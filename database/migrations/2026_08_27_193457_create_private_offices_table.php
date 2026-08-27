<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('private_offices', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->string('name');
            $table->string('slug')->unique();

            $table->string('image')->nullable();
            $table->string('image_alt')->nullable();

            $table->decimal('area_m2', 8, 2);

            $table->boolean('is_available')->default(false);

            $table->decimal('price', 12, 2)->nullable();
            $table->string('currency', 3)->default('CLP');

            $table->boolean('expenses_included')->default(true);

            $table->json('features')->nullable();

            $table->unsignedInteger('sort_order')->default(0);

            $table->boolean('is_visible')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('private_offices');
    }
};