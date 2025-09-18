<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exchangerates', function (Blueprint $table) {
            $table->id();
                $table->date('date');
                $table->string('currency');
                $table->decimal('price',10,2);
                $table->string('base_currency');
            $table->timestamps();
        });
    }
};
