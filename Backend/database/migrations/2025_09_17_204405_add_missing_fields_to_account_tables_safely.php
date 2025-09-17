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
        // Add missing fields to accounttypes table if they don't exist
        Schema::table('accounttypes', function (Blueprint $table) {
            if (!Schema::hasColumn('accounttypes', 'name_ru')) {
                $table->string('name_ru')->nullable()->after('name_az');
            }
            if (!Schema::hasColumn('accounttypes', 'category')) {
                $table->enum('category', ['income', 'expense'])->nullable()->after('name_ru');
            }
            if (!Schema::hasColumn('accounttypes', 'parent_id')) {
                $table->foreignId('parent_id')->nullable()->after('category');
                $table->foreign('parent_id')->references('id')->on('accounttypes')->onDelete('cascade');
            }
        });

        // Add missing fields to paymentnotes table if they don't exist
        Schema::table('paymentnotes', function (Blueprint $table) {
            if (!Schema::hasColumn('paymentnotes', 'note_ru')) {
                $table->string('note_ru')->nullable()->after('note_az');
            }
        });

        // Add transaction_date to all account tables if they don't exist
        Schema::table('customeraccounts', function (Blueprint $table) {
            if (!Schema::hasColumn('customeraccounts', 'transaction_date')) {
                $table->date('transaction_date')->nullable()->after('id');
            }
            if (!Schema::hasColumn('customeraccounts', 'customer_id')) {
                $table->unsignedBigInteger('customer_id')->nullable()->after('user_id');
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('set null');
            }
        });

        Schema::table('supplieraccounts', function (Blueprint $table) {
            if (!Schema::hasColumn('supplieraccounts', 'transaction_date')) {
                $table->date('transaction_date')->nullable()->after('id');
            }
            if (!Schema::hasColumn('supplieraccounts', 'supplier_id')) {
                $table->foreignId('supplier_id')->nullable()->after('user_id');
                $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('cascade');
            }
        });

        Schema::table('companyaccounts', function (Blueprint $table) {
            if (!Schema::hasColumn('companyaccounts', 'transaction_date')) {
                $table->date('transaction_date')->nullable()->after('id');
            }
            if (!Schema::hasColumn('companyaccounts', 'worker_entity_name')) {
                $table->string('worker_entity_name')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('companyaccounts', 'linked_invoice_number')) {
                $table->string('linked_invoice_number')->nullable()->after('invoice_number');
            }
        });

        Schema::table('warehouseaccounts', function (Blueprint $table) {
            if (!Schema::hasColumn('warehouseaccounts', 'transaction_date')) {
                $table->date('transaction_date')->nullable()->after('id');
            }
            if (!Schema::hasColumn('warehouseaccounts', 'customer_id')) {
                $table->foreignId('customer_id')->nullable()->after('user_id');
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            }
            if (!Schema::hasColumn('warehouseaccounts', 'supplier_id')) {
                $table->foreignId('supplier_id')->nullable()->after('customer_id');
                $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('warehouseaccounts', function (Blueprint $table) {
            $table->dropForeign(['supplier_id']);
            $table->dropForeign(['customer_id']);
            $table->dropColumn(['transaction_date', 'customer_id', 'supplier_id']);
        });

        Schema::table('companyaccounts', function (Blueprint $table) {
            $table->dropColumn(['transaction_date', 'worker_entity_name', 'linked_invoice_number']);
        });

        Schema::table('supplieraccounts', function (Blueprint $table) {
            $table->dropForeign(['supplier_id']);
            $table->dropColumn(['transaction_date', 'supplier_id']);
        });

        Schema::table('customeraccounts', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
            $table->dropColumn(['transaction_date', 'customer_id']);
        });

        Schema::table('paymentnotes', function (Blueprint $table) {
            $table->dropColumn('note_ru');
        });

        Schema::table('accounttypes', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['name_ru', 'category', 'parent_id']);
        });
    }
};
