<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categors', function (Blueprint $table) {
            $table->id();
                $table->string('category_en');
                $table->string('category_ru');
                $table->string('category_cn');
                $table->string('category_az');
                $table->string('category_code');
                
            $table->timestamps();
        });
    }
};
