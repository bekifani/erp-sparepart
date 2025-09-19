<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict')->onUpdate('cascade');
            $table->foreignId('supplier_id')->nullable();
            $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('restrict')->onUpdate('cascade');
            $table->string('supplier_code');
            $table->foreignId('brand_id')->nullable();
            $table->foreign('brand_id')->references('id')->on('brandnames')->onDelete('restrict')->onUpdate('cascade');
            $table->string('brand_code');
            $table->string('oe_code');
            $table->string('description');
            $table->string('unit_type');
            $table->integer('qty');
            $table->integer('min_qty');
            $table->decimal('purchase_price', 10, 2);
            $table->decimal('extra_cost', 10, 2);
            $table->decimal('cost_basis', 10, 2)->default(0);
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['In Stock', 'Out of Stock', 'In Supplier Warehouse']);
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }
};
