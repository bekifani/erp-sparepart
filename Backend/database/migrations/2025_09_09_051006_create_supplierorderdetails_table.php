<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supplierorderdetails', function (Blueprint $table) {
            $table->id();
                $table->foreignId('supplier_order_id')->nullable();
                $table->foreign('supplier_order_id')->references('id')->on('supplierorders')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('product_id')->nullable();
                $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('order_detail_id')->nullable();
                $table->foreign('order_detail_id')->references('id')->on('orderdetails')->onDelete('restrict')->onUpdate('cascade');
                $table->integer('qty');
                $table->decimal('price',10,2)->nullable();
                $table->string('shipping_mark')->nullable();
                $table->string('arrival_time')->nullable();
                $table->string('box_name')->nullable();
                $table->decimal('purchase_price',10,2)->nullable();
                $table->decimal('extra_cost',10,2)->nullable();
                $table->decimal('amount',10,2)->nullable();
                $table->foreignId('status_id')->nullable();
                $table->foreign('status_id')->references('id')->on('productstatuss')->onDelete('restrict')->onUpdate('cascade');
                $table->string('additional_note')->nullable();
                $table->string('image_url')->nullable();
                
            $table->timestamps();
        });
    }
};
