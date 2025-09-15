<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exchangerates', function (Blueprint $table) {
            // Rename price column to rate with higher precision
            $table->renameColumn('price', 'rate');
        });
        
        // Update the rate column to have higher precision in a separate statement
        Schema::table('exchangerates', function (Blueprint $table) {
            $table->decimal('rate', 10, 6)->change();
            $table->string('base_currency', 3)->default('RMB')->change();
            $table->string('currency', 3)->change();
            
            // Add unique constraint for date + currency combination
            $table->unique(['date', 'currency'], 'unique_date_currency');
        });
    }

    public function down(): void
    {
        Schema::table('exchangerates', function (Blueprint $table) {
            $table->dropUnique('unique_date_currency');
            $table->renameColumn('rate', 'price');
            $table->decimal('price', 10, 2)->change();
            $table->string('base_currency')->change();
            $table->string('currency')->change();
        });
    }
};
