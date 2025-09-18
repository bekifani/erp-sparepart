<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customeraccounts', function (Blueprint $table) {
            $table->foreignId('customer_id')->nullable()->after('trans_number');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict')->onUpdate('cascade');
            $table->date('transaction_date')->nullable()->after('customer_id');
        });
    }

    public function down(): void
    {
        Schema::table('customeraccounts', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
            $table->dropColumn(['customer_id', 'transaction_date']);
        });
    }
};
