<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supplierinvoices', function (Blueprint $table) {
            $table->id();
                $table->string('invoice_no');
                $table->foreignId('supplier_id')->nullable();
                $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('customer_id')->nullable();
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('user_id')->nullable();
                $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict')->onUpdate('cascade');
                $table->timestamp('arrival_time')->nullable();
                $table->date('shipping_date')->nullable();
                $table->date('shipped_date')->nullable();
                $table->string('shipping_mark')->nullable();
                $table->string('supplier_code')->nullable();
                $table->integer('total_products_qty')->nullable();
                $table->integer('total_qty')->nullable();
                $table->decimal('total_amount',10,2)->nullable();
                $table->decimal('total_weight',10,2)->nullable();
                $table->decimal('total_volume',10,3)->nullable();
                $table->integer('total_ctn')->nullable();
                $table->decimal('discount',10,2)->nullable();
                $table->decimal('deposit',10,2)->nullable();
                $table->decimal('extra_expenses',10,2)->nullable();
                $table->decimal('supplier_debt',10,2)->nullable();
                $table->decimal('balance',10,2)->nullable();
                $table->text('additional_note')->nullable();
                $table->string('status')->nullable();
                
            $table->timestamps();
        });
    }
};
