<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class TenantUserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Tenant Admin',
            'email' => 'tenantadmin@example.com',
            'phone' => '0987654321',
            'type' => 'Tenant Admin',
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
            'password' => Hash::make('password123'),
            'remember_token' => Str::random(10),
        ]);
    }
}
