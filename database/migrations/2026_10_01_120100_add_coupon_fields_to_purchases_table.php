<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->foreignId('coupon_id')->nullable()->after('client_id')->constrained()->nullOnDelete();
            $table->string('coupon_code', 30)->nullable()->after('coupon_id');
            $table->unsignedInteger('subtotal_amount')->nullable()->after('phone');
            $table->unsignedInteger('discount_amount')->default(0)->after('subtotal_amount');
        });
    }

    public function down(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropConstrainedForeignId('coupon_id');
            $table->dropColumn(['coupon_code', 'subtotal_amount', 'discount_amount']);
        });
    }
};
