<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->string('code', 3)->unique(); // Currency code (USD, EUR, etc.)
            $table->string('name'); // Currency name (US Dollar, Euro, etc.)
            $table->string('symbol', 10)->nullable(); // Currency symbol ($, €, etc.)
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Insert default currencies
        DB::table('currencies')->insert([
            ['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'EUR', 'name' => 'Euro', 'symbol' => '€', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'GBP', 'name' => 'British Pound', 'symbol' => '£', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'JPY', 'name' => 'Japanese Yen', 'symbol' => '¥', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'AUD', 'name' => 'Australian Dollar', 'symbol' => 'A$', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'CAD', 'name' => 'Canadian Dollar', 'symbol' => 'C$', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'CHF', 'name' => 'Swiss Franc', 'symbol' => 'CHF', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'CNY', 'name' => 'Chinese Yuan', 'symbol' => '¥', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'SEK', 'name' => 'Swedish Krona', 'symbol' => 'kr', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'NZD', 'name' => 'New Zealand Dollar', 'symbol' => 'NZ$', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('currencies');
    }
};
