<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
                $table->string('name_surname');
                $table->string('shipping_mark')->nullable();
                $table->foreignId('user_id')->nullable();
                $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict')->onUpdate('cascade');
                $table->string('country')->nullable();
                $table->string('address')->nullable();
                $table->string('email');
                $table->string('phone_number')->nullable();
                $table->string('whatsapp')->nullable();
                $table->string('wechat_id')->nullable();
                $table->string('image')->nullable();
                $table->text('additional_note')->nullable();
                
            $table->timestamps();
        });
    }
};
