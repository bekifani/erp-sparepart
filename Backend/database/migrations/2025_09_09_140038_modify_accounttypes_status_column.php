<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accounttypes', function (Blueprint $table) {
            $table->string('status')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('accounttypes', function (Blueprint $table) {
            $table->enum('status', ['active', 'inactive'])->nullable()->change();
        });
    }
};
