<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
                $table->foreignId('product_information_id')->nullable();
                $table->foreign('product_information_id')->references('id')->on('product_information')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('supplier_id')->nullable();
                $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('restrict')->onUpdate('cascade');
                $table->integer('qty');
                $table->integer('min_qty')->nullable();
                $table->decimal('purchase_price',10,2)->nullable();
                $table->decimal('extra_cost',10,2)->nullable();
                $table->decimal('cost_basis',10,2)->nullable();
                $table->decimal('selling_price',10,2)->nullable();
                $table->text('additional_note')->nullable();
                $table->string('status')->nullable();
                
            $table->timestamps();
        });
    }
};
