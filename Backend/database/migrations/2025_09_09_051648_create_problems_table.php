<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('problems', function (Blueprint $table) {
            $table->id();
                $table->string('problem_number');
                $table->foreignId('supplier_invoice_id')->nullable();
                $table->foreign('supplier_invoice_id')->references('id')->on('supplierinvoices')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('customer_invoice_id')->nullable();
                $table->foreign('customer_invoice_id')->references('id')->on('customerinvoices')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('user_id')->nullable();
                $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict')->onUpdate('cascade');
                $table->string('problem_type');
                $table->string('solution_type')->nullable();
                $table->foreignId('status_id')->nullable();
                $table->foreign('status_id')->references('id')->on('productstatuss')->onDelete('restrict')->onUpdate('cascade');
                $table->decimal('refund_amount',10,2)->nullable();
                $table->text('internal_note')->nullable();
                $table->text('customer_note')->nullable();
                
            $table->timestamps();
        });
    }
};
