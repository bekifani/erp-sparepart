<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accounttypes', function (Blueprint $table) {
            $table->id();
                $table->string('name');
                $table->string('name_ch');
                $table->string('name_az');
                $table->enum('status',enum)->nullable();
                
            $table->timestamps();
        });
    }
};
