<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
                $table->foreignId('sector_id')->nullable();
                $table->foreign('sector_id')->references('id')->on('sectors')->onDelete('restrict')->onUpdate('cascade');
                $table->string('category_name');
                $table->text('category_description')->nullable();
                $table->integer('category_order_level')->nullable();
                
            $table->timestamps();
        });
    }
};
