<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packinglistboxes', function (Blueprint $table) {
            $table->id();
                $table->foreignId('packing_list_id')->nullable();
                $table->foreign('packing_list_id')->references('id')->on('packinglists')->onDelete('restrict')->onUpdate('cascade');
                $table->string('box_no');
                $table->decimal('net_weight',10,2)->nullable();
                $table->decimal('gross_weight',10,2)->nullable();
                $table->decimal('volume',10,3)->nullable();
                $table->integer('number_of_products')->nullable();
                $table->text('additional_note')->nullable();
                
            $table->timestamps();
        });
    }
};
