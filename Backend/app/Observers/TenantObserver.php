<?php

namespace App\Observers;

use App\Models\Tenant;
use Illuminate\Support\Facades\DB;

class TenantObserver
{
    public function created(Tenant $tenant): void
    {
        $databaseName = $tenant->data['database'] ?? null;
        $query = "CREATE DATABASE `{$databaseName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
        try {
            DB::statement($query);
            \Log::info("Database {$databaseName} created for tenant ID {$tenant->id}");
        } catch (\Exception $e) {
            \Log::error("Failed to create database for tenant ID {$tenant->id}: " . $e->getMessage());
        }
    }

    public function updated(Tenant $tenant): void
    {
        //
    }

    public function deleted(Tenant $tenant): void
    {
        //
    }

    public function restored(Tenant $tenant): void
    {
        //
    }

    public function forceDeleted(Tenant $tenant): void
    {
        //
    }
}

