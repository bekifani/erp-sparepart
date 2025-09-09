<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warehouses', function (Blueprint $table) {
            $table->id();
                $table->string('warehouse_name');
                $table->string('location');
                $table->integer('capacity')->nullable();
                $table->text('remark')->nullable();
                $table->boolean('is_active');
                
            $table->timestamps();
        });
    }
};
