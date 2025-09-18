<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ledger_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g., 1100, 2100, 4100
            $table->string('name');
            $table->string('name_ru')->nullable();
            $table->string('name_az')->nullable();
            $table->string('name_ch')->nullable();
            $table->enum('ledger_type', ['general', 'subsidiary']);
            $table->string('account_class'); // asset, liability, equity, revenue, expense
            $table->boolean('is_contra')->default(false); // for contra accounts
            $table->foreignId('parent_id')->nullable();
            $table->foreign('parent_id')->references('id')->on('ledger_accounts')->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();
            
            $table->index(['ledger_type', 'is_active']);
            $table->index(['account_class', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ledger_accounts');
    }
};
