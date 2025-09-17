<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Add productname_id as foreign key to productnames table
            $table->unsignedBigInteger('productname_id')->nullable()->after('description');
            $table->foreign('productname_id')->references('id')->on('productnames')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['productname_id']);
            $table->dropColumn('productname_id');
        });
    }
};
