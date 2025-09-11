<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            if (!Schema::hasColumn('customers', 'price_adjustment_percent')) {
                $table->decimal('price_adjustment_percent', 8, 2)->nullable()->after('additional_note');
            }
            if (!Schema::hasColumn('customers', 'price_adjustment_type')) {
                $table->string('price_adjustment_type')->nullable()->after('price_adjustment_percent');
            }
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            if (Schema::hasColumn('customers', 'price_adjustment_type')) {
                $table->dropColumn('price_adjustment_type');
            }
            if (Schema::hasColumn('customers', 'price_adjustment_percent')) {
                $table->dropColumn('price_adjustment_percent');
            }
        });
    }
};
