<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('compans', function (Blueprint $table) {
            // Remove existing fields that are not needed
            $table->dropColumn([
                'name_cn',
                'company_address_cn', 
                'bank_details_cn',
                'contact_person',
                'tax_id',
                'registration_number',
                'status'
            ]);
            
            // Rename existing fields
            $table->renameColumn('name', 'company_name');
            $table->renameColumn('company_address', 'address');
            
            // Add new required fields
            $table->string('our_ref')->after('email');
            $table->string('origin')->nullable()->after('our_ref');
            $table->text('payment_terms')->nullable()->after('origin');
            $table->text('shipping_terms')->nullable()->after('payment_terms');
            $table->string('tax_number')->nullable()->after('shipping_terms');
            $table->string('mobile_number')->nullable()->after('tax_number');
            $table->text('additional_note')->nullable()->after('bank_details');
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
