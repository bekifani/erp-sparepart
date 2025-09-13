<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'product_name_id')) {
                $table->unsignedBigInteger('product_name_id')->nullable()->after('description');
                $table->index('product_name_id', 'products_product_name_id_idx');
            }
        });

        // Backfill using description match (try multiple language fields)
        // 1) name_az == products.description
        DB::statement("
            UPDATE products p
            JOIN productnames pn ON pn.name_az = p.description
            SET p.product_name_id = pn.id
            WHERE p.product_name_id IS NULL
        ");
        // 2) name_ru == products.description
        DB::statement("
            UPDATE products p
            JOIN productnames pn ON pn.name_ru = p.description
            SET p.product_name_id = pn.id
            WHERE p.product_name_id IS NULL
        ");
        // 3) description_en == products.description
        DB::statement("
            UPDATE products p
            JOIN productnames pn ON pn.description_en = p.description
            SET p.product_name_id = pn.id
            WHERE p.product_name_id IS NULL
        ");
        // 4) name_cn == products.description
        DB::statement("
            UPDATE products p
            JOIN productnames pn ON pn.name_cn = p.description
            SET p.product_name_id = pn.id
            WHERE p.product_name_id IS NULL
        ");

        // Keep column nullable for legacy rows; add FK on nullable column
        Schema::table('products', function (Blueprint $table) {
            // Do NOT change to NOT NULL here to avoid failing on legacy data
            if (!Schema::hasColumn('products', 'product_name_id')) {
                // defensive, but this block won't run since we already added the column
            }
            $table->foreign('product_name_id', 'products_product_name_id_fk')
                ->references('id')->on('productnames')
                ->onUpdate('cascade')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'product_name_id')) {
                $table->dropForeign('products_product_name_id_fk');
                $table->dropIndex('products_product_name_id_idx');
                $table->dropColumn('product_name_id');
            }
        });
    }
};
