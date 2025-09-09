<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('searchresults', function (Blueprint $table) {
            $table->id();
                $table->foreignId('user_id')->nullable();
                $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('customer_id')->nullable();
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict')->onUpdate('cascade');
                $table->string('query_text');
                $table->string('entity_type')->nullable();
                $table->integer('entity_id')->nullable();
                
            $table->timestamps();
        });
    }
};
