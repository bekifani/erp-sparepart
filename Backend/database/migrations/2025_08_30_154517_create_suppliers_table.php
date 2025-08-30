<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
                $table->string('supplier');
                $table->string('name_surname');
                $table->string('occupation')->nullable();
                $table->string('code')->nullable();
                $table->string('address')->nullable();
                $table->string('email');
                $table->string('phone_number')->nullable();
                $table->string('whatsapp')->nullable();
                $table->string('wechat_id')->nullable();
                $table->string('image')->nullable();
                $table->integer('number_of_products')->nullable();
                $table->string('category_of_products')->nullable();
                $table->string('name_of_products')->nullable();
                $table->text('additional_note')->nullable();
                
            $table->timestamps();
        });
    }
};
