<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packinglistboxitems', function (Blueprint $table) {
            $table->id();
                $table->foreignId('packing_list_box_id')->nullable();
                $table->foreign('packing_list_box_id')->references('id')->on('packinglistboxes')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('product_id')->nullable();
                $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict')->onUpdate('cascade');
                $table->integer('qty');
                $table->text('description')->nullable();
                
            $table->timestamps();
        });
    }
};
