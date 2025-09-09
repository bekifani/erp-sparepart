<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warehouseaccounts', function (Blueprint $table) {
            $table->id();
                $table->string('trans_number');
                $table->foreignId('user_id')->nullable();
                $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('warehouse_id')->nullable();
                $table->foreign('warehouse_id')->references('id')->on('warehouses')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('supplier_id')->nullable();
                $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('restrict')->onUpdate('cascade');
                $table->decimal('amount',12,2);
                $table->string('invoice_number')->nullable();
                $table->string('payment_status')->nullable();
                $table->foreignId('account_type_id')->nullable();
                $table->foreign('account_type_id')->references('id')->on('accounttypes')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('payment_note_id')->nullable();
                $table->foreign('payment_note_id')->references('id')->on('paymentnotes')->onDelete('restrict')->onUpdate('cascade');
                $table->text('picture_url')->nullable();
                $table->text('additional_note')->nullable();
                $table->decimal('balance',12,2)->nullable();
                
            $table->timestamps();
        });
    }
};
