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

           //Customer Permissions list 
             'customer-list', 'customer-create', 'customer-edit', 'customer-delete', 

           //Supplier Permissions list 
             'supplier-list', 'supplier-create', 'supplier-edit', 'supplier-delete', 

           //Categor Permissions list 
             'categor-list', 'categor-create', 'categor-edit', 'categor-delete', 

           //Productname Permissions list 
             'productname-list', 'productname-create', 'productname-edit', 'productname-delete', 

           //Carmodel Permissions list 
             'carmodel-list', 'carmodel-create', 'carmodel-edit', 'carmodel-delete', 

           //Brandname Permissions list 
             'brandname-list', 'brandname-create', 'brandname-edit', 'brandname-delete', 

           //Specificationheadname Permissions list 
             'specificationheadname-list', 'specificationheadname-create', 'specificationheadname-edit', 'specificationheadname-delete', 

           //Boxe Permissions list 
             'boxe-list', 'boxe-create', 'boxe-edit', 'boxe-delete', 

           //Label Permissions list 
             'label-list', 'label-create', 'label-edit', 'label-delete', 

           //Unit Permissions list 
             'unit-list', 'unit-create', 'unit-edit', 'unit-delete', 

           //ProductInformation Permissions list 
             'productInformation-list', 'productInformation-create', 'productInformation-edit', 'productInformation-delete', 

           //Product Permissions list 
             'product-list', 'product-create', 'product-edit', 'product-delete', 

           //Productimage Permissions list 
             'productimage-list', 'productimage-create', 'productimage-edit', 'productimage-delete', 

           //Crosscode Permissions list 
             'crosscode-list', 'crosscode-create', 'crosscode-edit', 'crosscode-delete', 

           //Crosscar Permissions list 
             'crosscar-list', 'crosscar-create', 'crosscar-edit', 'crosscar-delete', 

           //Productspecification Permissions list 
             'productspecification-list', 'productspecification-create', 'productspecification-edit', 'productspecification-delete', 

           //Exchangerate Permissions list 
             'exchangerate-list', 'exchangerate-create', 'exchangerate-edit', 'exchangerate-delete', 

           //Compan Permissions list 
             'compan-list', 'compan-create', 'compan-edit', 'compan-delete', 

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
