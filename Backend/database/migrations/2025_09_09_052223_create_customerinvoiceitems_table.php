<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customerinvoiceitems', function (Blueprint $table) {
            $table->id();
                $table->foreignId('customer_invoice_id')->nullable();
                $table->foreign('customer_invoice_id')->references('id')->on('customerinvoices')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('product_id')->nullable();
                $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict')->onUpdate('cascade');
                $table->string('hs_code')->nullable();
                $table->string('brand')->nullable();
                $table->string('brand_code')->nullable();
                $table->string('oe_code')->nullable();
                $table->text('description')->nullable();
                $table->integer('qty');
                $table->decimal('price',10,2);
                $table->decimal('amount',10,2)->nullable();
                $table->text('additional_note')->nullable();
                
            $table->timestamps();
        });
    }
};
