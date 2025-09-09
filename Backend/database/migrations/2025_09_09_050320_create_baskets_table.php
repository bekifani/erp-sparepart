<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('baskets', function (Blueprint $table) {
            $table->id();
                $table->string('basket_number');
                $table->foreignId('customer_id')->nullable();
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict')->onUpdate('cascade');
                $table->integer('total_qty')->nullable();
                $table->decimal('total_weight',10,2)->nullable();
                $table->decimal('total_volume',10,3)->nullable();
                $table->decimal('total_amount',10,2)->nullable();
                $table->string('invoice_language')->nullable();
                $table->string('status')->nullable();
                $table->timestamp('first_edit_date')->nullable();
                $table->timestamp('last_edit_date')->nullable();
                $table->text('additional_note')->nullable();
                
            $table->timestamps();
        });
    }
};
