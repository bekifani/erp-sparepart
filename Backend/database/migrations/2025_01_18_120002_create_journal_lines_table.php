<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journal_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_entry_id');
            $table->foreign('journal_entry_id')->references('id')->on('journal_entries')->onDelete('cascade');
            $table->foreignId('account_type_id');
            $table->foreign('account_type_id')->references('id')->on('accounttypes')->onDelete('restrict');
            $table->foreignId('ledger_account_id');
            $table->foreign('ledger_account_id')->references('id')->on('ledger_accounts')->onDelete('restrict');
            $table->string('ledger_account_type'); // customer, supplier, company, warehouse
            $table->unsignedBigInteger('ledger_account_ref_id'); // references customers.id, suppliers.id, etc.
            $table->decimal('debit', 15, 2)->default(0);
            $table->decimal('credit', 15, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->foreignId('payment_note_id')->nullable();
            $table->foreign('payment_note_id')->references('id')->on('paymentnotes')->onDelete('set null');
            $table->string('invoice_id')->nullable();
            $table->text('picture_url')->nullable();
            $table->json('metadata')->nullable(); // additional data
            $table->text('description')->nullable();
            $table->timestamps();
            
            $table->index(['journal_entry_id']);
            $table->index(['ledger_account_type', 'ledger_account_ref_id']);
            $table->index(['account_type_id']);
            $table->index(['ledger_account_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_lines');
    }
};
