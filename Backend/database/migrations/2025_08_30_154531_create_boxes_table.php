<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('boxes', function (Blueprint $table) {
            $table->id();
                $table->string('brand')->nullable();
                $table->string('box_name');
                $table->string('material')->nullable();
                $table->integer('stock_qty')->nullable();
                $table->integer('order_qty')->nullable();
                $table->decimal('price',10,2)->nullable();
                $table->decimal('size_a',10,2)->nullable();
                $table->decimal('size_b',10,2)->nullable();
                $table->decimal('size_c',10,2)->nullable();
                $table->decimal('volume',10,2)->nullable();
                $table->string('label')->nullable();
                $table->string('image')->nullable();
                $table->string('design_file')->nullable();
                $table->text('additional_note')->nullable();
                $table->string('operation_mode')->nullable();
                $table->boolean('is_factory_supplied');
                
            $table->timestamps();
        });
    }
};
