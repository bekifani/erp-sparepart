<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productstatuses', function (Blueprint $table) {
            $table->id();
            $table->string('status_key')->unique(); // Unique identifier for core statuses
            $table->string('status_name_en');
            $table->string('status_name_ch')->nullable();
            $table->string('status_name_az')->nullable();
            $table->text('description_en')->nullable();
            $table->text('description_ch')->nullable();
            $table->text('description_az')->nullable();
            $table->boolean('is_core_status')->default(false); // Identifies the 12 immutable core statuses
            $table->boolean('is_active')->default(true);
            $table->boolean('locks_editing')->default(false); // For "Loading Goods" status
            $table->integer('sort_order')->default(0); // For ordering statuses
            $table->json('rules')->nullable(); // JSON field for status-specific rules
            $table->string('color_code', 7)->default('#6B7280'); // Hex color for UI display
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['is_core_status', 'is_active']);
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productstatuses');
    }
};
