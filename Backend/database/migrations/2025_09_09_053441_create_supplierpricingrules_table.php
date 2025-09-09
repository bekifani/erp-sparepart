<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supplierpricingrules', function (Blueprint $table) {
            $table->id();
                $table->foreignId('supplier_id')->nullable();
                $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('restrict')->onUpdate('cascade');
                $table->decimal('adjustment_percent',6,3);
                $table->enum('adjustment_type',['markup','discount'])->nullable();
                $table->enum('scope',['all','selected'])->nullable();
                $table->boolean('active');
                $table->datetime('valid_from')->nullable();
                $table->datetime('valid_to')->nullable();
                
            $table->timestamps();
        });
    }
};
