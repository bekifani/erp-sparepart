<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productimages', function (Blueprint $table) {
            $table->id();
                $table->foreignId('product_information_id')->nullable();
                $table->foreign('product_information_id')->references('id')->on('product_information')->onDelete('restrict')->onUpdate('cascade');
                $table->string('image_url');
                $table->boolean('is_primary');
                $table->timestamp('uploaded_at');
                
            $table->timestamps();
        });
    }
};
