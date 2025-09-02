<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add customer_id field
            $table->foreignId('customer_id')->nullable()->after('employee_id');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict')->onUpdate('cascade');
        });

        // Update the type enum to include Customer
        DB::statement("ALTER TABLE users MODIFY COLUMN type ENUM('Super Admin', 'Tenant Admin', 'Employee', 'Company Owner', 'Customer') DEFAULT 'Employee'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
            $table->dropColumn('customer_id');
        });

        // Revert the type enum
        DB::statement("ALTER TABLE users MODIFY COLUMN type ENUM('Super Admin', 'Tenant Admin', 'Employee', 'Company Owner') DEFAULT 'Employee'");
    }
};
