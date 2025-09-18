<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('labels', function (Blueprint $table) {
            $table->id();
                $table->string('brand');
                $table->string('label_name');
                $table->decimal('price',10,2);
                $table->integer('stock_qty');
                $table->integer('order_qty')->nullable();
                $table->decimal('labels_size_a',10,2)->nullable();
                $table->decimal('labels_size_b',10,2)->nullable();
                $table->string('image')->nullable();
                $table->string('design_file')->nullable();
                $table->text('additional_note')->nullable();
                $table->string('operation_mode')->nullable();
                $table->boolean('is_factory_supplied')->nullable();
                
            $table->timestamps();
        });
    }
};
