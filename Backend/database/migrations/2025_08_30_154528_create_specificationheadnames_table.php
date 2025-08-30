<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('specificationheadnames', function (Blueprint $table) {
            $table->id();
                $table->string('headname')->nullable();
                $table->string('translate_az')->nullable();
                $table->string('translate_ru')->nullable();
                $table->string('translate_ch')->nullable();
                
            $table->timestamps();
        });
    }
};
