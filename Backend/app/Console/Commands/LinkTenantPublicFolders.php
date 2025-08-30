<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class LinkTenantPublicFolders extends Command
{
    protected $signature = 'tenancy:link-public-folders';
    protected $description = 'Create symbolic links for all tenant public folders.';

    public function handle()
    {
        $tenants = ['tenantbar', 'tenantfoo', 'tenanttest']; // List your tenant names here

        foreach ($tenants as $tenant) {
            $tenantPublicPath = storage_path("{$tenant}/app/public");
            $publicPath = public_path("tenants/{$tenant}");
            if (File::exists($tenantPublicPath)) {
                if (!File::exists($publicPath)) {
                    // File::makeDirectory($publicPath, 0775, true); // Create directory if it does not exist
                    File::link($tenantPublicPath, $publicPath);
                    $this->info("Linked public folder for tenant: {$tenant}");
                } else {
                    $this->warn("Public folder already exists for tenant: {$tenant}");
                }
            } else {
                $this->error("Public folder does not exist for tenant: {$tenant}");
            }
            
        }

        $this->info('All tenant public folders linked successfully.');
    }
}
