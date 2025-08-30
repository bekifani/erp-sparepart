<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
                $table->string('name');
                $table->string('base_unit');
                $table->decimal('base_value',10,2);
                
            $table->timestamps();
        });
    }
};
