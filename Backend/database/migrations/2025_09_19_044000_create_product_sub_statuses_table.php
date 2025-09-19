<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_sub_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_status_id')->constrained('productstatuses')->onDelete('cascade');
            $table->string('sub_status_key')->unique(); // Unique identifier like "3.1", "3.2"
            $table->string('status_name_en');
            $table->string('status_name_ch')->nullable();
            $table->string('status_name_az')->nullable();
            $table->text('description_en')->nullable();
            $table->text('description_ch')->nullable();
            $table->text('description_az')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0); // For ordering within parent status
            $table->json('rules')->nullable(); // JSON field for sub-status-specific rules
            $table->string('color_code', 7)->default('#6B7280'); // Hex color for UI display
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['parent_status_id', 'is_active']);
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_sub_statuses');
    }
};
