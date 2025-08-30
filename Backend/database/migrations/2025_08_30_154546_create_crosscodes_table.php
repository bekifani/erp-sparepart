<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crosscodes', function (Blueprint $table) {
            $table->id();
                $table->foreignId('product_id')->nullable();
                $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('car_model_id')->nullable();
                $table->foreign('car_model_id')->references('id')->on('carmodels')->onDelete('restrict')->onUpdate('cascade');
                $table->boolean('show');
                
            $table->timestamps();
        });
    }
};
