<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
                $table->string('entity_type');
                $table->integer('entity_id');
                $table->string('file_path');
                $table->string('file_type');
                $table->string('original_filename')->nullable();
                $table->foreignId('uploaded_by')->nullable();
                $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('restrict')->onUpdate('cascade');
                
            $table->timestamps();
        });
    }
};
