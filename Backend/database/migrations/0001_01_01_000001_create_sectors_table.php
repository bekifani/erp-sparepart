<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sectors', function (Blueprint $table) {
            $table->id();
                $table->string('photo');
                $table->string('sector_name');
                $table->string('sector_description')->nullable();
                $table->integer('sector_order_level')->nullable();
                
            $table->timestamps();
        });
    }
};
