<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cost_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_line_id');
            $table->foreign('journal_line_id')->references('id')->on('journal_lines')->onDelete('cascade');
            $table->string('invoice_id'); // references to invoice tables
            $table->string('invoice_type'); // customerinvoice, supplierinvoice, etc.
            $table->decimal('allocation_amount', 15, 2);
            $table->decimal('allocation_percentage', 5, 2)->nullable(); // percentage of total cost
            $table->text('allocation_method')->nullable(); // manual, auto, percentage
            $table->text('description')->nullable();
            $table->foreignId('allocated_by'); // user who made the allocation
            $table->foreign('allocated_by')->references('id')->on('users')->onDelete('restrict');
            $table->timestamps();
            
            $table->index(['invoice_id', 'invoice_type']);
            $table->index(['journal_line_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cost_allocations');
    }
};
