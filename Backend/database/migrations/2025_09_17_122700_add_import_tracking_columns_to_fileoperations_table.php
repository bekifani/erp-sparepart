<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fileoperations', function (Blueprint $table) {
            $table->integer('records_processed')->default(0)->after('status');
            $table->integer('records_imported')->default(0)->after('records_processed');
            $table->integer('records_skipped')->default(0)->after('records_imported');
            $table->integer('error_count')->default(0)->after('records_skipped');
        });
    }

    public function down(): void
    {
        Schema::table('fileoperations', function (Blueprint $table) {
            $table->dropColumn(['records_processed', 'records_imported', 'records_skipped', 'error_count']);
        });
    }
};
