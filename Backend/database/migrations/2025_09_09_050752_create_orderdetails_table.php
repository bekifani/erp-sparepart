<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orderdetails', function (Blueprint $table) {
            $table->id();
                $table->foreignId('order_id')->nullable();
                $table->foreign('order_id')->references('id')->on('orders')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('product_id')->nullable();
                $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict')->onUpdate('cascade');
                $table->decimal('unit_price',10,2);
                $table->integer('qty');
                $table->decimal('line_total',10,2)->nullable();
                $table->date('arrival_time');
                $table->foreignId('status_id')->nullable();
                $table->foreign('status_id')->references('id')->on('productstatuses')->onDelete('restrict')->onUpdate('cascade');
                $table->text('additional_note')->nullable();
                
            $table->timestamps();
        });
    }
};
