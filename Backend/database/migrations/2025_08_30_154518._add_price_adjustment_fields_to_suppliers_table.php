<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            if (!Schema::hasColumn('suppliers', 'price_adjustment_type')) {
                $table->enum('price_adjustment_type', ['increase', 'decrease'])->nullable()->after('additional_note');
            }
            if (!Schema::hasColumn('suppliers', 'price_adjustment_percent')) {
                $table->decimal('price_adjustment_percent', 5, 2)->nullable()->after('price_adjustment_type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn(['price_adjustment_type', 'price_adjustment_percent']);
        });
    }
};
