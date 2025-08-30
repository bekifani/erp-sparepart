<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carmodels', function (Blueprint $table) {
            $table->id();
                $table->string('car_model');
                $table->text('additional_note')->nullable();
                $table->integer('product_qty')->nullable();
                
            $table->timestamps();
        });
    }
};
