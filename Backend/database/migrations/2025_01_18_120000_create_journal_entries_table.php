<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journal_entries', function (Blueprint $table) {
            $table->id();
            $table->string('trans_number')->unique();
            $table->date('date');
            $table->string('source_table'); // customeraccounts, supplieraccounts, etc.
            $table->foreignId('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'posted', 'reversed'])->default('posted');
            $table->foreignId('reversed_by')->nullable();
            $table->foreign('reversed_by')->references('id')->on('journal_entries')->onDelete('set null');
            $table->timestamps();
            
            $table->index(['date', 'status']);
            $table->index(['source_table', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_entries');
    }
};
