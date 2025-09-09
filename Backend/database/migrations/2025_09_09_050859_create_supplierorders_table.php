<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supplierorders', function (Blueprint $table) {
            $table->id();
                $table->string('supplier_invoice_no');
                $table->foreignId('supplier_id')->nullable();
                $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('restrict')->onUpdate('cascade');
                $table->date('order_date');
                $table->date('expected_date')->nullable();
                $table->date('shipping_date')->nullable();
                $table->string('order_period')->nullable();
                $table->string('arrival_time')->nullable();
                $table->integer('qty');
                $table->decimal('amount',10,2)->nullable();
                $table->decimal('discount',10,2)->nullable();
                $table->decimal('extra_expenses',10,2)->nullable();
                $table->foreignId('status_id')->nullable();
                $table->foreign('status_id')->references('id')->on('productstatuss')->onDelete('restrict')->onUpdate('cascade');
                $table->text('internal_note')->nullable();
                $table->text('customer_note')->nullable();
                
            $table->timestamps();
        });
    }
};
