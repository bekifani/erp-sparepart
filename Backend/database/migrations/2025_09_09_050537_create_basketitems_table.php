<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('basketitems', function (Blueprint $table) {
            $table->id();
                $table->foreignId('basket_id')->nullable();
                $table->foreign('basket_id')->references('id')->on('baskets')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('product_id')->nullable();
                $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict')->onUpdate('cascade');
                $table->string('brand');
                $table->string('brand_code');
                $table->string('oe_code')->nullable();
                $table->text('description');
                $table->decimal('unit_price',10,2);
                $table->foreignId('file_id')->nullable();
                $table->foreign('file_id')->references('id')->on('basketfiles')->onDelete('restrict')->onUpdate('cascade');
                $table->integer('qty');
                $table->decimal('line_total',10,2)->nullable();
                $table->decimal('weight_per_unit',10,2)->nullable();
                $table->decimal('volume_per_unit',10,3)->nullable();
                
            $table->timestamps();
        });
    }
};
