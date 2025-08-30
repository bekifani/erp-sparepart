<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
class PermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = [ 
           //Product Permissions list 
           'view-general-dashboard', 
           'view-hr-menu',
            'user-list', 'user-create', 'user-edit', 'user-delete','activity-list', 
            'role-list', 'role-create', 'role-edit', 'role-delete', 
           //Company Permissions list 
            
           //Employee Permissions list 
            'employee-list', 'employee-create', 'employee-edit', 'employee-delete', 'terminate-employee',
           
           //Sector Permissions list 
             'sector-list', 'sector-create', 'sector-edit', 'sector-delete', 

           //Categorie Permissions list 
             'categorie-list', 'categorie-create', 'categorie-edit', 'categorie-delete', 

           //Compan Permissions list 
             'compan-list', 'compan-create', 'compan-edit', 'compan-delete', 

           //Addresstype Permissions list 
             'addresstype-list', 'addresstype-create', 'addresstype-edit', 'addresstype-delete', 

           //Addressbook Permissions list 
             'addressbook-list', 'addressbook-create', 'addressbook-edit', 'addressbook-delete', 

           //Ad Permissions list 
             'ad-list', 'ad-create', 'ad-edit', 'ad-delete', 

           //Contact Permissions list 
             'contact-list', 'contact-create', 'contact-edit', 'contact-delete', 

           //Sponsor Permissions list 
             'sponsor-list', 'sponsor-create', 'sponsor-edit', 'sponsor-delete', 
             'view-my-company', 'view-my-business-qr','view-my-account',

           //Setting Permissions list 
             'setting-list', 'setting-create', 'setting-edit', 'setting-delete', 

        ];
        $roles = ['Admin', 'Employee', 'Manager','Company Owner'];
        foreach ($permissions as $permission) {
            try {
              if(!Permission::where('name', $permission)->exists()) {
                Permission::create([
                    'name' => $permission,
                    'guard_name' => 'api'
                ]);
              }
            } catch (Exception $e) {
                
            }
        }
        foreach($roles as $role){
            try {
              if(!Role::where('name', $role)->exists()) {
                Role::create([
                    'name' => $role,
                    'guard_name' => 'api'
                ]);
              }
            } catch (Exception $e) {
                
            }
        }
        $admin = Role::where('name', 'Admin')->first();
        $admin->syncPermissions(Permission::all());
    }
}
