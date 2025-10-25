<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Tạo bảng users với đầy đủ thông tin cho hệ thống gói quà
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->enum('role', ['admin', 'user'])->default('user');
            $table->boolean('is_active')->default(true);
            $table->string('google_id')->nullable();
            $table->string('student_id')->nullable();
            $table->string('university')->nullable();
            $table->text('address')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->boolean('is_student_verified')->default(false);
            $table->decimal('total_spent', 12, 2)->default(0);
            $table->integer('total_orders')->default(0);
            $table->integer('loyalty_points')->default(0);
            $table->enum('membership_level', ['bronze', 'silver', 'gold', 'platinum'])->default('bronze');
            $table->timestamp('last_order_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // Tạo bảng gift_categories
        Schema::create('gift_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->string('icon_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Tạo bảng gift_packages
        Schema::create('gift_packages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->string('image_url')->nullable();
            $table->string('banner_url')->nullable();
            $table->enum('status', ['active', 'inactive', 'draft'])->default('active');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_student_discount')->default(false);
            $table->uuid('category_id');
            $table->string('target_audience')->nullable();
            $table->string('delivery_time')->nullable();
            $table->integer('warranty_period')->nullable();
            $table->decimal('rating', 3, 1)->default(0);
            $table->integer('review_count')->default(0);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->json('tags')->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->integer('sold_count')->default(0);
            $table->decimal('weight', 8, 2)->nullable();
            $table->json('dimensions')->nullable();
            $table->boolean('is_digital')->default(false);
            $table->json('gallery')->nullable();
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('gift_categories')->onDelete('cascade');
        });

        // Tạo bảng orders
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('order_code')->unique();
            $table->unsignedBigInteger('user_id');
            $table->decimal('total_amount', 12, 2);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('final_amount', 12, 2);
            $table->enum('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])->default('pending');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->enum('delivery_status', ['pending', 'preparing', 'shipped', 'delivered', 'failed'])->default('pending');
            $table->string('payment_method')->nullable();
            $table->text('gift_message')->nullable();
            $table->uuid('coupon_id')->nullable();
            $table->string('coupon_code')->nullable();
            $table->decimal('coupon_discount', 10, 2)->default(0);
            $table->text('order_notes')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // Tạo bảng order_items
        Schema::create('order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('order_id');
            $table->uuid('gift_package_id');
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_price', 10, 2);
            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('gift_package_id')->references('id')->on('gift_packages')->onDelete('cascade');
        });

        // Tạo bảng deliveries
        Schema::create('deliveries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('order_id');
            $table->text('delivery_address');
            $table->string('delivery_phone');
            $table->text('delivery_notes')->nullable();
            $table->date('delivery_date')->nullable();
            $table->time('delivery_time')->nullable();
            $table->enum('delivery_status', ['pending', 'preparing', 'shipped', 'delivered', 'failed'])->default('pending');
            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });

        // Tạo bảng payments
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('order_id');
            $table->string('payment_method');
            $table->enum('payment_status', ['pending', 'success', 'failed', 'refunded', 'cancelled'])->default('pending');
            $table->decimal('amount', 12, 2);
            $table->string('transaction_id')->nullable();
            $table->json('payment_data')->nullable();
            $table->timestamp('payment_date')->nullable();
            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });

        // Tạo bảng reviews
        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->unsignedBigInteger('user_id');
            $table->uuid('gift_package_id');
            $table->integer('rating');
            $table->string('title')->nullable();
            $table->text('comment')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_approved')->default(false);
            $table->integer('helpful_count')->default(0);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('gift_package_id')->references('id')->on('gift_packages')->onDelete('cascade');
        });

        // Tạo bảng coupons
        Schema::create('coupons', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['percentage', 'fixed_amount', 'free_shipping'])->default('percentage');
            $table->decimal('value', 10, 2);
            $table->decimal('minimum_amount', 10, 2)->nullable();
            $table->decimal('maximum_discount', 10, 2)->nullable();
            $table->integer('usage_limit')->nullable();
            $table->integer('used_count')->default(0);
            $table->integer('user_limit')->default(1);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('applicable_categories')->nullable();
            $table->timestamps();
        });

        // Tạo bảng user_coupons
        Schema::create('user_coupons', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->unsignedBigInteger('user_id');
            $table->uuid('coupon_id');
            $table->timestamp('used_at')->nullable();
            $table->decimal('discount_amount', 10, 2)->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('coupon_id')->references('id')->on('coupons')->onDelete('cascade');
            $table->unique(['user_id', 'coupon_id']);
        });

        // Tạo bảng wishlists
        Schema::create('wishlists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->unsignedBigInteger('user_id');
            $table->uuid('gift_package_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('gift_package_id')->references('id')->on('gift_packages')->onDelete('cascade');
            $table->unique(['user_id', 'gift_package_id']);
        });

        // Tạo bảng notifications
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->unsignedBigInteger('user_id');
            $table->string('type');
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['user_id', 'is_read']);
        });

        // Tạo bảng system_settings
        Schema::create('system_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('setting_key')->unique();
            $table->text('setting_value')->nullable();
            $table->enum('data_type', ['string', 'number', 'boolean', 'json'])->default('string');
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false);
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });

        // Thêm foreign key cho orders.coupon_id
        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('coupon_id')->references('id')->on('coupons')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('wishlists');
        Schema::dropIfExists('user_coupons');
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('deliveries');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('gift_packages');
        Schema::dropIfExists('gift_categories');
        Schema::dropIfExists('users');
    }
};
