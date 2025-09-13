<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('product_information', function (Blueprint $table) {
            // Add qty field
            $table->decimal('qty', 10, 2)->nullable()->after('volume');
            
            // Modify image field to support multiple images (JSON array)
            $table->json('pictures')->nullable()->after('image');
            
            // Add box_type field to track 2D/3D mode
            $table->enum('box_type', ['2D', '3D'])->nullable()->after('box_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_information', function (Blueprint $table) {
            $table->dropColumn(['qty', 'pictures', 'box_type']);
        });
    }
};
