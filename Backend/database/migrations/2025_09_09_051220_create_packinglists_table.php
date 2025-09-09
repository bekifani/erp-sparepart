<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packinglists', function (Blueprint $table) {
            $table->id();
                $table->foreignId('order_id')->nullable();
                $table->foreign('order_id')->references('id')->on('orders')->onDelete('restrict')->onUpdate('cascade');
                $table->string('invoice_no');
                $table->integer('qty');
                $table->decimal('net_weight',10,2)->nullable();
                $table->decimal('total_weight',10,2)->nullable();
                $table->decimal('total_volume',10,2)->nullable();
                $table->integer('number_of_boxes')->nullable();
                $table->date('order_date');
                $table->date('order_period');
                $table->date('shipping_date');
                $table->foreignId('status_id')->nullable();
                $table->foreign('status_id')->references('id')->on('productstatuses')->onDelete('restrict')->onUpdate('cascade');
                $table->text('additional_note')->nullable();
                
            $table->timestamps();
        });
    }
};
