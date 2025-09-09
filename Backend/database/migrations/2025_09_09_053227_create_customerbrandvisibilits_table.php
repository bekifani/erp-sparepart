<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customerbrandvisibilits', function (Blueprint $table) {
            $table->id();
                $table->foreignId('customer_id')->nullable();
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('brand_id')->nullable();
                $table->foreign('brand_id')->references('id')->on('brandnames')->onDelete('restrict')->onUpdate('cascade');
                $table->enum('visibility',['allow','deny'])->nullable();
                
            $table->timestamps();
        });
    }
};
