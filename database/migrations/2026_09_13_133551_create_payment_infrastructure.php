<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->uuid('operation_key')->unique();
            $table->char('request_hash', 64);
            $table->morphs('product');
            $table->foreignId('client_id')->nullable()->constrained()->restrictOnDelete();
            $table->string('email');
            $table->string('phone', 30);
            $table->unsignedInteger('amount');
            $table->json('snapshot');
            $table->string('status', 30)->default('pending')->index();
            $table->string('flow', 20)->default('checkout');
            $table->timestamps();
        });
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->uuid('idempotency_key')->unique();
            $table->morphs('payable');
            $table->unsignedInteger('amount');
            $table->string('currency', 3)->default('CLP');
            $table->string('environment', 20);
            $table->string('buy_order', 26)->unique();
            $table->string('session_id', 61)->unique();
            $table->text('token')->nullable();
            $table->char('token_hash', 64)->nullable()->unique();
            $table->text('redirect_url')->nullable();
            $table->string('status', 30)->default('pending')->index();
            $table->string('provider_status', 30)->nullable();
            $table->integer('response_code')->nullable();
            $table->string('authorization_code', 30)->nullable();
            $table->timestamp('transaction_date')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('create_started_at')->nullable();
            $table->timestamp('commit_started_at')->nullable();
            $table->timestamp('checked_at')->nullable();
            $table->timestamp('expires_at');
            $table->unsignedSmallInteger('check_attempts')->default(0);
            $table->string('review_reason', 80)->nullable();
            $table->timestamps();
            $table->index(['status', 'checked_at']);
        });
        Schema::create('payment_notifications', function (Blueprint $table) {
            $table->id();
            $table->morphs('notifiable');
            $table->string('event', 40);
            $table->string('recipient_type', 20);
            $table->string('recipient');
            $table->longText('payload');
            $table->string('status', 20)->default('pending')->index();
            $table->timestamp('sending_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
            $table->unique(['notifiable_type', 'notifiable_id', 'event', 'recipient_type'], 'payment_notification_event_unique');
        });
        Schema::table('reservations', function (Blueprint $table) {
            $table->uuid('operation_key')->nullable()->unique();
            $table->char('request_hash', 64)->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->text('pending_client_data')->nullable();
        });
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->foreignId('purchase_id')->nullable()->unique()->constrained()->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('purchase_id');
        });
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropUnique(['operation_key']);
            $table->dropIndex(['expires_at']);
            $table->dropColumn(['operation_key', 'request_hash', 'expires_at', 'pending_client_data']);
        });
        Schema::dropIfExists('payment_notifications');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('purchases');
    }
};
