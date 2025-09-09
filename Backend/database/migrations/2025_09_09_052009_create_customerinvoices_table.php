<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customerinvoices', function (Blueprint $table) {
            $table->id();
                $table->string('invoice_no');
                $table->foreignId('customer_id')->nullable();
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict')->onUpdate('cascade');
                $table->string('company_name');
                $table->string('customer_name');
                $table->string('country')->nullable();
                $table->text('address')->nullable();
                $table->string('tax_id')->nullable();
                $table->string('phone_number')->nullable();
                $table->string('email')->nullable();
                $table->string('shipping_mark')->nullable();
                $table->date('shipped_date')->nullable();
                $table->string('language')->nullable();
                $table->integer('total_qty')->nullable();
                $table->decimal('total_net_weight',10,2)->nullable();
                $table->decimal('total_gross_weight',10,2)->nullable();
                $table->decimal('total_volume',10,3)->nullable();
                $table->decimal('total_amount',10,2)->nullable();
                $table->decimal('discount',10,2)->nullable();
                $table->decimal('deposit',10,2)->nullable();
                $table->decimal('extra_expenses',10,2)->nullable();
                $table->decimal('customer_debt',10,2)->nullable();
                $table->decimal('balance',10,2)->nullable();
                $table->string('status')->nullable();
                $table->string('attached_file')->nullable();
                $table->foreignId('created_by')->nullable();
                $table->foreign('created_by')->references('id')->on('users')->onDelete('restrict')->onUpdate('cascade');
                
            $table->timestamps();
        });
    }
};
