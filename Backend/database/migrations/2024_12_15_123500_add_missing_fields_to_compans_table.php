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
        Schema::table('compans', function (Blueprint $table) {
            // Add trading name field
            $table->string('trading_name')->nullable()->after('company_name');
            
            // Split address into structured fields
            $table->string('street_address')->nullable()->after('address');
            $table->string('city')->nullable()->after('street_address');
            $table->string('state_region')->nullable()->after('city');
            $table->string('postal_code')->nullable()->after('state_region');
            $table->string('country')->nullable()->after('postal_code');
            
            // Add business registration number
            $table->string('business_registration_number')->nullable()->after('tax_number');
            
            // Split tax number into VAT and Tax ID
            $table->string('vat_number')->nullable()->after('business_registration_number');
            
            // Only rename tax_number to tax_id if tax_number column exists
            if (Schema::hasColumn('compans', 'tax_number')) {
                $table->renameColumn('tax_number', 'tax_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('compans', function (Blueprint $table) {
            $table->dropColumn([
                'trading_name',
                'street_address', 
                'city',
                'state_region',
                'postal_code',
                'country',
                'business_registration_number',
                'vat_number'
            ]);
            
            // Only rename tax_id back to tax_number if tax_id column exists
            if (Schema::hasColumn('compans', 'tax_id')) {
                $table->renameColumn('tax_id', 'tax_number');
            }
        });
    }
};
