<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('compans', function (Blueprint $table) {
            $table->id();
                $table->foreignId('category')->nullable();
                $table->foreign('category')->references('id')->on('categories')->onDelete('restrict')->onUpdate('cascade');
                $table->string('company_logo');
                $table->string('company_name');
                $table->integer('order_level')->nullable();
                
            $table->timestamps();
        });
    }
};
