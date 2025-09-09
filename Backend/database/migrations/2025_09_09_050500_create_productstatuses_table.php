<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productstatuses', function (Blueprint $table) {
            $table->id();
                $table->string('status_key');
                $table->string('status_name_en');
                $table->string('status_name_ch')->nullable();
                $table->string('status_name_az')->nullable();
                $table->text('description')->nullable();
                
            $table->timestamps();
        });
    }
};
