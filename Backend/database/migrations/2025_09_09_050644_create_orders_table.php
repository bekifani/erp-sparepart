<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
                $table->foreignId('customer_id')->nullable();
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict')->onUpdate('cascade');
                $table->string('invoice_no');
                $table->integer('total_qty')->nullable();
                $table->decimal('total_weight',10,2)->nullable();
                $table->decimal('total_volume',10,3)->nullable();
                $table->decimal('subtotal',10,2)->nullable();
                $table->decimal('discount',10,2)->nullable();
                $table->decimal('extra_expenses',10,2)->nullable();
                $table->decimal('total_amount',10,2)->nullable();
                $table->decimal('deposit',10,2)->nullable();
                $table->decimal('customer_debt',10,2)->nullable();
                $table->decimal('balance',10,2)->nullable();
                $table->date('order_date');
                $table->date('expected_date')->nullable();
                $table->date('shipping_date')->nullable();
                $table->foreignId('status_id')->nullable();
                $table->foreign('status_id')->references('id')->on('productstatuses')->onDelete('restrict')->onUpdate('cascade');
                $table->string('invoice_language')->nullable();
                $table->foreignId('company_id')->nullable();
                $table->foreign('company_id')->references('id')->on('compans')->onDelete('restrict')->onUpdate('cascade');
                $table->text('internal_note')->nullable();
                $table->text('customer_note')->nullable();
                
            $table->timestamps();
        });
    }
};
