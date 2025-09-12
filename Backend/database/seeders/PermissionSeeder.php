<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Exceptions\PermissionAlreadyExists;
use Spatie\Permission\Exceptions\RoleAlreadyExists;

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
             'productinformation-list', 'productinformation-create', 'productinformation-edit', 'productinformation-delete', 

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

           //Basket Permissions list 
             'basket-list', 'basket-create', 'basket-edit', 'basket-delete', 

           //Basketfile Permissions list 
             'basketfile-list', 'basketfile-create', 'basketfile-edit', 'basketfile-delete', 

           //Basketitem Permissions list 
             'basketitem-list', 'basketitem-create', 'basketitem-edit', 'basketitem-delete', 

           //Order Permissions list 
             'order-list', 'order-create', 'order-edit', 'order-delete', 

           //Orderdetail Permissions list 
             'orderdetail-list', 'orderdetail-create', 'orderdetail-edit', 'orderdetail-delete', 

           //Supplierorder Permissions list 
             'supplierorder-list', 'supplierorder-create', 'supplierorder-edit', 'supplierorder-delete', 

           //Supplierorderdetail Permissions list 
             'supplierorderdetail-list', 'supplierorderdetail-create', 'supplierorderdetail-edit', 'supplierorderdetail-delete', 

           //Packagin Permissions list 
             'packagin-list', 'packagin-create', 'packagin-edit', 'packagin-delete', 

           //Packinglist Permissions list 
             'packinglist-list', 'packinglist-create', 'packinglist-edit', 'packinglist-delete', 

           //Packinglistbox Permissions list 
             'packinglistbox-list', 'packinglistbox-create', 'packinglistbox-edit', 'packinglistbox-delete', 

           //Packinglistboxitem Permissions list 
             'packinglistboxitem-list', 'packinglistboxitem-create', 'packinglistboxitem-edit', 'packinglistboxitem-delete', 

           //Attachment Permissions list 
             'attachment-list', 'attachment-create', 'attachment-edit', 'attachment-delete', 

           //Problem Permissions list 
             'problem-list', 'problem-create', 'problem-edit', 'problem-delete', 

           //Problemitem Permissions list 
             'problemitem-list', 'problemitem-create', 'problemitem-edit', 'problemitem-delete', 

           //Productstatus Permissions list 
             'productstatus-list', 'productstatus-create', 'productstatus-edit', 'productstatus-delete', 

           //Customerinvoice Permissions list 
             'customerinvoice-list', 'customerinvoice-create', 'customerinvoice-edit', 'customerinvoice-delete', 

           //Warehouse Permissions list 
             'warehouse-list', 'warehouse-create', 'warehouse-edit', 'warehouse-delete', 

           //Customerinvoiceitem Permissions list 
             'customerinvoiceitem-list', 'customerinvoiceitem-create', 'customerinvoiceitem-edit', 'customerinvoiceitem-delete', 

           //Supplierinvoice Permissions list 
             'supplierinvoice-list', 'supplierinvoice-create', 'supplierinvoice-edit', 'supplierinvoice-delete', 

           //Supplierinvoiceitem Permissions list 
             'supplierinvoiceitem-list', 'supplierinvoiceitem-create', 'supplierinvoiceitem-edit', 'supplierinvoiceitem-delete', 

           //Accounttype Permissions list 
             'accounttype-list', 'accounttype-create', 'accounttype-edit', 'accounttype-delete', 

           //Paymentnote Permissions list 
             'paymentnote-list', 'paymentnote-create', 'paymentnote-edit', 'paymentnote-delete', 

           //Productrule Permissions list 
             'productrule-list', 'productrule-create', 'productrule-edit', 'productrule-delete', 

           //Packagingproblem Permissions list 
             'packagingproblem-list', 'packagingproblem-create', 'packagingproblem-edit', 'packagingproblem-delete', 

           //Searchresult Permissions list 
             'searchresult-list', 'searchresult-create', 'searchresult-edit', 'searchresult-delete', 

           //Fileoperation Permissions list 
             'fileoperation-list', 'fileoperation-create', 'fileoperation-edit', 'fileoperation-delete', 

           //Customerbrandvisibilit Permissions list 
             'customerbrandvisibilit-list', 'customerbrandvisibilit-create', 'customerbrandvisibilit-edit', 'customerbrandvisibilit-delete', 

           //Customerproductvisibilit Permissions list 
             'customerproductvisibilit-list', 'customerproductvisibilit-create', 'customerproductvisibilit-edit', 'customerproductvisibilit-delete', 

           //Supplierpricingrule Permissions list 
             'supplierpricingrule-list', 'supplierpricingrule-create', 'supplierpricingrule-edit', 'supplierpricingrule-delete', 

           //Supplierpricingrulecustomer Permissions list 
             'supplierpricingrulecustomer-list', 'supplierpricingrulecustomer-create', 'supplierpricingrulecustomer-edit', 'supplierpricingrulecustomer-delete', 

           //Supplierproduct Permissions list 
             'supplierproduct-list', 'supplierproduct-create', 'supplierproduct-edit', 'supplierproduct-delete', 

           //Customeraccount Permissions list 
             'customeraccount-list', 'customeraccount-create', 'customeraccount-edit', 'customeraccount-delete', 

           //Companyaccount Permissions list 
             'companyaccount-list', 'companyaccount-create', 'companyaccount-edit', 'companyaccount-delete', 

           //Warehouseaccount Permissions list 
             'warehouseaccount-list', 'warehouseaccount-create', 'warehouseaccount-edit', 'warehouseaccount-delete', 

           //Supplieraccount Permissions list 
             'supplieraccount-list', 'supplieraccount-create', 'supplieraccount-edit', 'supplieraccount-delete', 

           //Producthistor Permissions list 
             'producthistor-list', 'producthistor-create', 'producthistor-edit', 'producthistor-delete', 

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
            } catch (PermissionAlreadyExists $e) {
                // Permission already exists, continue
            } catch (Exception $e) {
                // Handle other exceptions
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
            } catch (RoleAlreadyExists $e) {
                // Role already exists, continue
            } catch (Exception $e) {
                // Handle other exceptions
            }
        }
        $admin = Role::where('name', 'Admin')->first();
        $admin->syncPermissions(Permission::all());
    }
}
