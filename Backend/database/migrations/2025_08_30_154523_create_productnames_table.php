<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productnames', function (Blueprint $table) {
            $table->id();
                $table->string('hs_code')->nullable();
                $table->string('name_az');
                $table->string('description_en');
                $table->string('name_ru');
                $table->string('name_cn');
                $table->unsignedBigInteger('category_id');
                $table->foreign('category_id')->references('id')->on('categors');
                $table->string('product_name_code');
                $table->text('additional_note')->nullable();
                $table->integer('product_qty')->nullable();
                
            $table->timestamps();
        });
    }
};
