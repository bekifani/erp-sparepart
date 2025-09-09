<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supplierpricingrulecustomers', function (Blueprint $table) {
            $table->id();
                $table->foreignId('rule_id')->nullable();
                $table->foreign('rule_id')->references('id')->on('supplierpricingrules')->onDelete('restrict')->onUpdate('cascade');
                $table->foreignId('customer_id')->nullable();
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict')->onUpdate('cascade');
                
            $table->timestamps();
        });
    }
};
