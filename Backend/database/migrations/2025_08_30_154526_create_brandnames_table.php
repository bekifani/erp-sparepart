<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brandnames', function (Blueprint $table) {
            $table->id();
                $table->string('brand_code');
                $table->string('brand_name');
                $table->string('name_az')->nullable();
                $table->string('name_ru')->nullable();
                $table->string('name_cn')->nullable();
                $table->integer('number_of_products')->nullable();
                
            $table->timestamps();
        });
    }
};
