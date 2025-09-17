<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('compans', function (Blueprint $table) {
            // Remove existing fields that are not needed (check if they exist first)
            $columnsToCheck = ['name_cn', 'company_address_cn', 'bank_details_cn', 'contact_person', 'tax_id', 'registration_number', 'status'];
            $columnsToRemove = [];
            
            foreach ($columnsToCheck as $column) {
                if (Schema::hasColumn('compans', $column)) {
                    $columnsToRemove[] = $column;
                }
            }
            
            if (!empty($columnsToRemove)) {
                $table->dropColumn($columnsToRemove);
            }
            
            // Rename existing fields (check if they exist first)
            if (Schema::hasColumn('compans', 'name') && !Schema::hasColumn('compans', 'company_name')) {
                $table->renameColumn('name', 'company_name');
            }
            if (Schema::hasColumn('compans', 'company_address') && !Schema::hasColumn('compans', 'address')) {
                $table->renameColumn('company_address', 'address');
            }
            
            // Add new required fields (check if they don't exist first)
            if (!Schema::hasColumn('compans', 'our_ref')) {
                $table->string('our_ref')->after('email');
            }
            if (!Schema::hasColumn('compans', 'origin')) {
                $table->string('origin')->nullable()->after('our_ref');
            }
            if (!Schema::hasColumn('compans', 'payment_terms')) {
                $table->text('payment_terms')->nullable()->after('origin');
            }
            if (!Schema::hasColumn('compans', 'shipping_terms')) {
                $table->text('shipping_terms')->nullable()->after('payment_terms');
            }
            if (!Schema::hasColumn('compans', 'tax_number')) {
                $table->string('tax_number')->nullable()->after('shipping_terms');
            }
            if (!Schema::hasColumn('compans', 'mobile_number')) {
                $table->string('mobile_number')->nullable()->after('tax_number');
            }
            if (!Schema::hasColumn('compans', 'additional_note')) {
                $table->text('additional_note')->nullable()->after('bank_details');
            }
        });
    }

    public function down(): void
    {
        Schema::table('compans', function (Blueprint $table) {
            // Reverse the changes
            $table->renameColumn('company_name', 'name');
            $table->renameColumn('address', 'company_address');
            
            // Add back removed fields
            $table->string('name_cn')->nullable()->after('name');
            $table->string('company_address_cn')->nullable()->after('company_address');
            $table->text('bank_details_cn')->nullable()->after('bank_details');
            $table->string('contact_person')->nullable()->after('bank_details_cn');
            $table->string('tax_id')->nullable()->after('website');
            $table->string('registration_number')->nullable()->after('tax_id');
            $table->string('status')->nullable()->after('registration_number');
            
            // Remove new fields
            $table->dropColumn([
                'our_ref',
                'origin',
                'payment_terms',
                'shipping_terms',
                'tax_number',
                'mobile_number',
                'additional_note'
            ]);
        });
    }
};
