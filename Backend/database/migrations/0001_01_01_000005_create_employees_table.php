<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
                $table->string('photo');
                $table->string('first_name');
                $table->string('last_name');
                $table->string('email')->nullable();
                $table->string('phone')->nullable();
                $table->float('salary')->nullable();
                $table->date('hire_date');
                $table->boolean('is_active');
                $table->text('note')->nullable();
                
            $table->timestamps();
        });
    }
};
