<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Use raw SQL to safely add unique constraints
        try {
            DB::statement('ALTER TABLE customers ADD CONSTRAINT customers_phone_number_unique UNIQUE (phone_number)');
        } catch (\Exception $e) {
            // Constraint might already exist, ignore
        }
        
        try {
            DB::statement('ALTER TABLE customers ADD CONSTRAINT customers_whatsapp_unique UNIQUE (whatsapp)');
        } catch (\Exception $e) {
            // Constraint might already exist, ignore
        }
        
        try {
            DB::statement('ALTER TABLE customers ADD CONSTRAINT customers_wechat_id_unique UNIQUE (wechat_id)');
        } catch (\Exception $e) {
            // Constraint might already exist, ignore
        }
    }

    public function down(): void
    {
        try {
            DB::statement('ALTER TABLE customers DROP INDEX customers_phone_number_unique');
        } catch (\Exception $e) {
            // Constraint might not exist, ignore
        }
        
        try {
            DB::statement('ALTER TABLE customers DROP INDEX customers_whatsapp_unique');
        } catch (\Exception $e) {
            // Constraint might not exist, ignore
        }
        
        try {
            DB::statement('ALTER TABLE customers DROP INDEX customers_wechat_id_unique');
        } catch (\Exception $e) {
            // Constraint might not exist, ignore
        }
    }
};
