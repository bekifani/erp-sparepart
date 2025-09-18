<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('balances', function (Blueprint $table) {
            $table->id();
            $table->string('ledger_account_type'); // customer, supplier, company, warehouse
            $table->unsignedBigInteger('ledger_account_ref_id'); // references customers.id, suppliers.id, etc.
            $table->foreignId('ledger_account_id');
            $table->foreign('ledger_account_id')->references('id')->on('ledger_accounts')->onDelete('cascade');
            $table->decimal('current_balance', 15, 2)->default(0);
            $table->decimal('debit_total', 15, 2)->default(0);
            $table->decimal('credit_total', 15, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->timestamp('last_transaction_date')->nullable();
            $table->timestamps();
            
            $table->unique(['ledger_account_type', 'ledger_account_ref_id', 'ledger_account_id'], 'unique_balance_account');
            $table->index(['ledger_account_type', 'ledger_account_ref_id']);
            $table->index(['ledger_account_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('balances');
    }
};
