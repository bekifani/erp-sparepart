<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productrules', function (Blueprint $table) {
            $table->id();
                $table->foreignId('customer_id')->nullable();
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('product_id')->nullable();
                $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict')->onUpdate('cascade');
                $table->decimal('fixed_price',12,2)->nullable();
                $table->decimal('adjustment_percent',6,3)->nullable();
                $table->integer('qty');
                $table->string('note')->nullable();
                
            $table->timestamps();
        });
    }
};
