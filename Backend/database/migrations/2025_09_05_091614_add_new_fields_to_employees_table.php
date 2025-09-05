<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->string('position')->nullable()->after('last_name');
            $table->string('whatsapp')->nullable()->after('phone');
            $table->string('wechat')->nullable()->after('whatsapp');
            $table->date('birthdate')->nullable()->after('wechat');
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['position', 'whatsapp', 'wechat', 'birthdate']);
        });
    }
};
