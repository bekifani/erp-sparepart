<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_information', function (Blueprint $table) {
            $table->id();
                $table->foreignId('product_name_id')->nullable();
                $table->foreign('product_name_id')->references('id')->on('productnames')->onDelete('restrict')->onUpdate('cascade');
                $table->string('product_code');
                $table->foreignId('brand_code')->nullable();
                $table->foreign('brand_code')->references('id')->on('brandnames')->onDelete('restrict')->onUpdate('cascade');
                $table->string('oe_code')->nullable();
                $table->string('description')->nullable();
                $table->decimal('net_weight',10,2)->nullable();
                $table->decimal('gross_weight',10,2)->nullable();
                $table->foreignId('unit_id')->nullable();
                $table->foreign('unit_id')->references('id')->on('units')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('box_id')->nullable();
                $table->foreign('box_id')->references('id')->on('boxes')->onDelete('restrict')->onUpdate('cascade');
                $table->decimal('product_size_a',10,2)->nullable();
                $table->decimal('product_size_b',10,2)->nullable();
                $table->decimal('product_size_c',10,2)->nullable();
                $table->decimal('volume',10,2)->nullable();
                $table->foreignId('label_id')->nullable();
                $table->foreign('label_id')->references('id')->on('labels')->onDelete('restrict')->onUpdate('cascade');
                $table->string('qr_code')->nullable();
                $table->string('properties')->nullable();
                $table->string('technical_image')->nullable();
                $table->string('image')->nullable();
                $table->string('size_mode')->nullable();
                $table->text('additional_note')->nullable();
                
            $table->timestamps();
        });
    }
};
