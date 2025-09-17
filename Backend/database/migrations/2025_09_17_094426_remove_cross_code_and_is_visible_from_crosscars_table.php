<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('crosscars', function (Blueprint $table) {
            $table->dropColumn(['cross_code', 'is_visible']);
        });
    }

    public function down(): void
    {
        Schema::table('crosscars', function (Blueprint $table) {
            $table->string('cross_code');
            $table->boolean('is_visible');
        });
    }
};
