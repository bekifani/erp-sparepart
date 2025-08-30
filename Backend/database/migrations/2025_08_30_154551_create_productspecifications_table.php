<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productspecifications', function (Blueprint $table) {
            $table->id();
                $table->foreignId('product_id')->nullable();
                $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('headname_id')->nullable();
                $table->foreign('headname_id')->references('id')->on('specificationheadnames')->onDelete('restrict')->onUpdate('cascade');
                $table->string('value');
                
            $table->timestamps();
        });
    }
};
