<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
class UserSeeder extends Seeder
{
    public function run()
    {
        $admin = User::create([
            'name' => 'Tenant Admin',
            'email' => 'tenantadmin@example.com',
            'phone' => '0987654321',
            'type' => 'Tenant Admin',
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
            'password' => bcrypt('password'),
        ]);
        $admin->assignRole('Admin');
    }
}
