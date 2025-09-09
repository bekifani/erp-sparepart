<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fileoperations', function (Blueprint $table) {
            $table->id();
                $table->foreignId('user_id')->nullable();
                $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('product_id')->nullable();
                $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict')->onUpdate('cascade');
                $table->string('file_path');
                $table->string('operation_type');
                $table->string('status')->nullable();
                
            $table->timestamps();
        });
    }
};
