<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('brandnames', function (Blueprint $table) {
            if (Schema::hasColumn('brandnames', 'brand_code')) {
                $table->dropColumn('brand_code');
            }
            if (Schema::hasColumn('brandnames', 'name_az')) {
                $table->dropColumn('name_az');
            }
            if (Schema::hasColumn('brandnames', 'name_ru')) {
                $table->dropColumn('name_ru');
            }
            if (Schema::hasColumn('brandnames', 'name_cn')) {
                $table->dropColumn('name_cn');
            }
        });
    }

    public function down(): void
    {
        Schema::table('brandnames', function (Blueprint $table) {
            if (!Schema::hasColumn('brandnames', 'brand_code')) {
                $table->string('brand_code')->nullable();
            }
            if (!Schema::hasColumn('brandnames', 'name_az')) {
                $table->string('name_az')->nullable();
            }
            if (!Schema::hasColumn('brandnames', 'name_ru')) {
                $table->string('name_ru')->nullable();
            }
            if (!Schema::hasColumn('brandnames', 'name_cn')) {
                $table->string('name_cn')->nullable();
            }
        });
    }
};