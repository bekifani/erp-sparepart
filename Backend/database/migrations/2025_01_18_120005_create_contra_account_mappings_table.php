<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contra_account_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_type_id');
            $table->foreign('account_type_id')->references('id')->on('accounttypes')->onDelete('cascade');
            $table->foreignId('payment_note_id')->nullable();
            $table->foreign('payment_note_id')->references('id')->on('paymentnotes')->onDelete('cascade');
            $table->foreignId('contra_ledger_account_id');
            $table->foreign('contra_ledger_account_id')->references('id')->on('ledger_accounts')->onDelete('cascade');
            $table->string('transaction_type'); // customer, supplier, company, warehouse
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();
            
            $table->unique(['account_type_id', 'payment_note_id', 'transaction_type'], 'unique_contra_mapping');
            $table->index(['transaction_type', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contra_account_mappings');
    }
};
