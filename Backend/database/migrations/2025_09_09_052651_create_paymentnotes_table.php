<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paymentnotes', function (Blueprint $table) {
            $table->id();
                $table->string('note');
                $table->string('note_ch');
                $table->string('note_az');
                
            $table->timestamps();
        });
    }
};
