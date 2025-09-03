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
        Schema::table('crosscodes', function (Blueprint $table) {
            // Drop foreign key constraint and column
            $table->dropForeign(['car_model_id']);
            $table->dropColumn('car_model_id');
            
            // Add new fields
            $table->string('cross_band')->nullable();
            $table->string('cross_code')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('crosscodes', function (Blueprint $table) {
            // Remove new fields
            $table->dropColumn(['cross_band', 'cross_code']);
            
            // Add back car_model_id
            $table->foreignId('car_model_id')->nullable();
            $table->foreign('car_model_id')->references('id')->on('carmodels')->onDelete('restrict')->onUpdate('cascade');
        });
    }
};
