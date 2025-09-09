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
                $table->foreignId('supplier_id')->nullable();
                $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('product_id')->nullable();
                $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict')->onUpdate('cascade');
                $table->decimal('price',12,2)->nullable();
                $table->integer('quantity');
                $table->decimal('amount',14,2)->nullable();
                $table->string('note')->nullable();
                
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productrules');
    }
};
