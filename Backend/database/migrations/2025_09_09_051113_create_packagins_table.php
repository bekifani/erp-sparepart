<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packagins', function (Blueprint $table) {
            $table->id();
                $table->foreignId('order_id')->nullable();
                $table->foreign('order_id')->references('id')->on('orders')->onDelete('restrict')->onUpdate('cascade');
                $table->string('shipping_mark');
                $table->string('invoice_no');
                $table->integer('qty');
                $table->decimal('net_weight',10,2)->nullable();
                $table->decimal('total_weight',10,2)->nullable();
                $table->decimal('total_volume',10,2)->nullable();
                $table->integer('number_of_boxes')->nullable();
                $table->date('order_date');
                $table->foreignId('status_id')->nullable();
                $table->foreign('status_id')->references('id')->on('productstatuss')->onDelete('restrict')->onUpdate('cascade');
                $table->text('internal_note')->nullable();
                $table->text('customer_note')->nullable();
                
            $table->timestamps();
        });
    }
};
