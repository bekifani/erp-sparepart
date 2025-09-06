<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'brand_code')) {
                $table->string('brand_code')->nullable()->after('brand_id');
            }
        });

   
    }

    public function down(): void
    {
              Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'brand_code')) {
                $table->dropColumn('brand_code');
            }
        });
    }
};