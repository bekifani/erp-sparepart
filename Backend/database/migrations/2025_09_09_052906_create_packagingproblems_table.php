<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packagingproblems', function (Blueprint $table) {
            $table->id();
                $table->foreignId('package_id')->nullable();
                $table->foreign('package_id')->references('id')->on('packagins')->onDelete('restrict')->onUpdate('cascade');
                $table->text('problems');
                $table->text('additional_note')->nullable();
                
            $table->timestamps();
        });
    }
};
