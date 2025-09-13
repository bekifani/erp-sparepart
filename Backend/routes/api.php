<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByRequestData;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\SettingController;

Route::prefix('public')->group(function () {
    
    
});


require __DIR__.'/auth.php';
Route::middleware(['auth.api'])->group(function(){
    Route::post('/uploadFile', [App\Http\Controllers\FileUploadController::class, 'uploadFile']);
    Route::post('/retrieve-File', [App\Http\Controllers\FileUploadController::class, 'retrieveFile']);
    //Role Controllers
    Broadcast::routes(['middleware' => ['auth:sanctum']]);


    Route::get('/employee', [App\Http\Controllers\EmployeeController::class, 'index'])->middleware('permission:employee-list|employee-create|employee-edit|employee-delete');
    Route::get('/employee/{id}', [App\Http\Controllers\EmployeeController::class, 'show'])->middleware('permission:employee-list|employee-create|employee-edit|employee-delete');
    Route::get('/search_employee/{search_term}', [App\Http\Controllers\EmployeeController::class, 'search'])->middleware('permission:employee-list|employee-create|employee-edit|employee-delete');
    Route::post('/employee', [App\Http\Controllers\EmployeeController::class, 'store'])->middleware('permission:employee-create');
    Route::put('/employee/{id}', [App\Http\Controllers\EmployeeController::class, 'update'])->middleware('permission:employee-edit');
    Route::delete('/employee/{id}', [App\Http\Controllers\EmployeeController::class, 'destroy'])->middleware('permission:employee-delete');
    Route::get('/all_employees', [App\Http\Controllers\EmployeeController::class,'all_employees']);
    Route::post('terminate-employee/{id}',  [App\Http\Controllers\EmployeeController::class, 'terminate'])->middleware('permission:terminate-employee');
    Route::post('activate-employee-account/{id}',  [App\Http\Controllers\EmployeeController::class, 'activate_account'])->middleware('permission:terminate-employee');

    Route::get('/user', [App\Http\Controllers\UserController::class, 'index'])->middleware('permission:user-list|user-create|user-edit|user-delete');
    Route::get('/user/{id}', [App\Http\Controllers\UserController::class, 'show'])->middleware('permission:user-list|user-create|user-edit|user-delete');
    Route::get('/search_user/{search_term}', [App\Http\Controllers\UserController::class, 'search'])->middleware('permission:user-list|user-create|user-edit|user-delete');
    Route::post('/user', [App\Http\Controllers\UserController::class, 'store'])->middleware('permission:user-create');
    Route::put('/user/{id}', [App\Http\Controllers\UserController::class, 'update'])->middleware('permission:user-edit');
    Route::delete('/user/{id}', [App\Http\Controllers\UserController::class, 'destroy'])->middleware('permission:user-delete');
    Route::get('/all_users', [App\Http\Controllers\UserController::class,'all_users']);
    Route::post('/reset_user_password', [App\Http\Controllers\UserController::class,'reset_user_password']);
    Route::get('/getActivities', [App\Http\Controllers\ActivityController::class,'getActivities']);
    Route::get('/role', [App\Http\Controllers\RoleController::class, 'index'])->middleware('permission:role-list|role-create|role-edit|role-delete');
    Route::get('/role/{id}', [App\Http\Controllers\RoleController::class, 'show'])->middleware('permission:role-list|role-create|role-edit|role-delete');
    Route::get('/search_role/{search_term}', [App\Http\Controllers\RoleController::class, 'search'])->middleware('permission:role-list|role-create|role-edit|role-delete');
    Route::post('/role', [App\Http\Controllers\RoleController::class, 'store'])->middleware('permission:role-create');
    Route::put('/role/{id}', [App\Http\Controllers\RoleController::class, 'update'])->middleware('permission:role-edit');
    Route::delete('/role/{id}', [App\Http\Controllers\RoleController::class, 'destroy'])->middleware('permission:role-delete');
    Route::post('/change_password', [App\Http\Controllers\UserController::class,'change_password']);
    //notification page 
    Route::get('notifications', [App\Http\Controllers\NotificationController::class, 'index']);

Route::get('/customer', [App\Http\Controllers\CustomerController::class, 'index'])->middleware('permission:customer-list|customer-create|customer-edit|customer-delete');
Route::get('/customer/{id}', [App\Http\Controllers\CustomerController::class, 'show'])->middleware('permission:customer-list|customer-create|customer-edit|customer-delete');
Route::get('/search_customer/{search_term}', [App\Http\Controllers\CustomerController::class, 'search'])->middleware('permission:customer-list|customer-create|customer-edit|customer-delete');
Route::post('/customer', [App\Http\Controllers\CustomerController::class, 'store'])->middleware('permission:customer-create');
Route::put('/customer/{id}', [App\Http\Controllers\CustomerController::class, 'update'])->middleware('permission:customer-edit');
Route::delete('/customer/{id}', [App\Http\Controllers\CustomerController::class, 'destroy'])->middleware('permission:customer-delete');
Route::get('/all_customers', [App\Http\Controllers\CustomerController::class,'all_customers']);


Route::get('/supplier', [App\Http\Controllers\SupplierController::class, 'index'])->middleware('permission:supplier-list|supplier-create|supplier-edit|supplier-delete');
Route::get('/supplier/{id}', [App\Http\Controllers\SupplierController::class, 'show'])->middleware('permission:supplier-list|supplier-create|supplier-edit|supplier-delete');
Route::get('/search_supplier/{search_term}', [App\Http\Controllers\SupplierController::class, 'search'])->middleware('permission:supplier-list|supplier-create|supplier-edit|supplier-delete');
Route::post('/supplier', [App\Http\Controllers\SupplierController::class, 'store'])->middleware('permission:supplier-create');
Route::put('/supplier/{id}', [App\Http\Controllers\SupplierController::class, 'update'])->middleware('permission:supplier-edit');
Route::delete('/supplier/{id}', [App\Http\Controllers\SupplierController::class, 'destroy'])->middleware('permission:supplier-delete');
Route::get('/all_suppliers', [App\Http\Controllers\SupplierController::class,'all_suppliers']);
Route::post('/check_existing_main_suppliers', [App\Http\Controllers\SupplierController::class, 'checkExistingMainSuppliers'])->middleware('permission:supplier-edit');


Route::get('/categor', [App\Http\Controllers\CategorController::class, 'index'])->middleware('permission:categor-list|categor-create|categor-edit|categor-delete');
Route::get('/categor/{id}', [App\Http\Controllers\CategorController::class, 'show'])->middleware('permission:categor-list|categor-create|categor-edit|categor-delete');
Route::get('/search_categor/{search_term}', [App\Http\Controllers\CategorController::class, 'search'])->middleware('permission:categor-list|categor-create|categor-edit|categor-delete');
Route::post('/categor', [App\Http\Controllers\CategorController::class, 'store'])->middleware('permission:categor-create');
Route::put('/categor/{id}', [App\Http\Controllers\CategorController::class, 'update'])->middleware('permission:categor-edit');
Route::delete('/categor/{id}', [App\Http\Controllers\CategorController::class, 'destroy'])->middleware('permission:categor-delete');
Route::get('/all_categors', [App\Http\Controllers\CategorController::class,'all_categors']);


Route::get('/productname', [App\Http\Controllers\ProductnameController::class, 'index'])->middleware('permission:productname-list|productname-create|productname-edit|productname-delete');
Route::get('/productname/{id}', [App\Http\Controllers\ProductnameController::class, 'show'])->middleware('permission:productname-list|productname-create|productname-edit|productname-delete');
Route::get('/search_productname/{search_term}', [App\Http\Controllers\ProductnameController::class, 'search'])->middleware('permission:productname-list|productname-create|productname-edit|productname-delete');
Route::post('/productname', [App\Http\Controllers\ProductnameController::class, 'store'])->middleware('permission:productname-create');
Route::put('/productname/{id}', [App\Http\Controllers\ProductnameController::class, 'update'])->middleware('permission:productname-edit');
Route::delete('/productname/{id}', [App\Http\Controllers\ProductnameController::class, 'destroy'])->middleware('permission:productname-delete');
Route::get('/all_productnames', [App\Http\Controllers\ProductnameController::class,'all_productnames']);


Route::get('/carmodel', [App\Http\Controllers\CarmodelController::class, 'index'])->middleware('permission:carmodel-list|carmodel-create|carmodel-edit|carmodel-delete');
Route::get('/carmodel/{id}', [App\Http\Controllers\CarmodelController::class, 'show'])->middleware('permission:carmodel-list|carmodel-create|carmodel-edit|carmodel-delete');
Route::get('/search_carmodel/{search_term}', [App\Http\Controllers\CarmodelController::class, 'search'])->middleware('permission:carmodel-list|carmodel-create|carmodel-edit|carmodel-delete');
Route::post('/carmodel', [App\Http\Controllers\CarmodelController::class, 'store'])->middleware('permission:carmodel-create');
Route::put('/carmodel/{id}', [App\Http\Controllers\CarmodelController::class, 'update'])->middleware('permission:carmodel-edit');
Route::delete('/carmodel/{id}', [App\Http\Controllers\CarmodelController::class, 'destroy'])->middleware('permission:carmodel-delete');
Route::get('/all_carmodels', [App\Http\Controllers\CarmodelController::class,'all_carmodels']);


Route::get('/brandname', [App\Http\Controllers\BrandnameController::class, 'index'])->middleware('permission:brandname-list|brandname-create|brandname-edit|brandname-delete');
Route::get('/brandname/{id}', [App\Http\Controllers\BrandnameController::class, 'show'])->middleware('permission:brandname-list|brandname-create|brandname-edit|brandname-delete');
Route::get('/search_brandname/{search_term}', [App\Http\Controllers\BrandnameController::class, 'search'])->middleware('permission:brandname-list|brandname-create|brandname-edit|brandname-delete');
Route::post('/brandname', [App\Http\Controllers\BrandnameController::class, 'store'])->middleware('permission:brandname-create');
Route::put('/brandname/{id}', [App\Http\Controllers\BrandnameController::class, 'update'])->middleware('permission:brandname-edit');
Route::delete('/brandname/{id}', [App\Http\Controllers\BrandnameController::class, 'destroy'])->middleware('permission:brandname-delete');
Route::get('/all_brandnames', [App\Http\Controllers\BrandnameController::class,'all_brandnames']);


Route::get('/specificationheadname', [App\Http\Controllers\SpecificationheadnameController::class, 'index'])->middleware('permission:specificationheadname-list|specificationheadname-create|specificationheadname-edit|specificationheadname-delete');
Route::get('/specificationheadname/{id}', [App\Http\Controllers\SpecificationheadnameController::class, 'show'])->middleware('permission:specificationheadname-list|specificationheadname-create|specificationheadname-edit|specificationheadname-delete');
Route::get('/search_specificationheadname/{search_term}', [App\Http\Controllers\SpecificationheadnameController::class, 'search'])->middleware('permission:specificationheadname-list|specificationheadname-create|specificationheadname-edit|specificationheadname-delete');
Route::post('/specificationheadname', [App\Http\Controllers\SpecificationheadnameController::class, 'store'])->middleware('permission:specificationheadname-create');
Route::put('/specificationheadname/{id}', [App\Http\Controllers\SpecificationheadnameController::class, 'update'])->middleware('permission:specificationheadname-edit');
Route::delete('/specificationheadname/{id}', [App\Http\Controllers\SpecificationheadnameController::class, 'destroy'])->middleware('permission:specificationheadname-delete');
Route::post('/specificationheadname/merge', [App\Http\Controllers\SpecificationheadnameController::class, 'merge'])->middleware('permission:specificationheadname-edit');
Route::get('/all_specificationheadnames', [App\Http\Controllers\SpecificationheadnameController::class,'all_specificationheadnames']);


Route::get('/boxe', [App\Http\Controllers\BoxeController::class, 'index'])->middleware('permission:boxe-list|boxe-create|boxe-edit|boxe-delete');
Route::get('/boxe/{id}', [App\Http\Controllers\BoxeController::class, 'show'])->middleware('permission:boxe-list|boxe-create|boxe-edit|boxe-delete');
Route::get('/search_boxe/{search_term}', [App\Http\Controllers\BoxeController::class, 'search'])->middleware('permission:boxe-list|boxe-create|boxe-edit|boxe-delete');
Route::post('/boxe', [App\Http\Controllers\BoxeController::class, 'store']);
Route::put('/boxe/{id}', [App\Http\Controllers\BoxeController::class, 'update'])->middleware('permission:boxe-edit');
Route::delete('/boxe/{id}', [App\Http\Controllers\BoxeController::class, 'destroy'])->middleware('permission:boxe-delete');
Route::get('/all_boxes', [App\Http\Controllers\BoxeController::class,'all_boxes']);


Route::get('/label', [App\Http\Controllers\LabelController::class, 'index'])->middleware('permission:label-list|label-create|label-edit|label-delete');
Route::get('/label/{id}', [App\Http\Controllers\LabelController::class, 'show'])->middleware('permission:label-list|label-create|label-edit|label-delete');
Route::get('/search_label/{search_term}', [App\Http\Controllers\LabelController::class, 'search'])->middleware('permission:label-list|label-create|label-edit|label-delete');
Route::post('/label', [App\Http\Controllers\LabelController::class, 'store'])->middleware('permission:label-create');
Route::put('/label/{id}', [App\Http\Controllers\LabelController::class, 'update'])->middleware('permission:label-edit');
Route::delete('/label/{id}', [App\Http\Controllers\LabelController::class, 'destroy'])->middleware('permission:label-delete');
Route::get('/all_labels', [App\Http\Controllers\LabelController::class,'all_labels']);


Route::get('/unit', [App\Http\Controllers\UnitController::class, 'index'])->middleware('permission:unit-list|unit-create|unit-edit|unit-delete');
Route::get('/unit/{id}', [App\Http\Controllers\UnitController::class, 'show'])->middleware('permission:unit-list|unit-create|unit-edit|unit-delete');
Route::get('/search_unit/{search_term}', [App\Http\Controllers\UnitController::class, 'search'])->middleware('permission:unit-list|unit-create|unit-edit|unit-delete');
Route::post('/unit', [App\Http\Controllers\UnitController::class, 'store'])->middleware('permission:unit-create');
Route::put('/unit/{id}', [App\Http\Controllers\UnitController::class, 'update'])->middleware('permission:unit-edit');
Route::delete('/unit/{id}', [App\Http\Controllers\UnitController::class, 'destroy'])->middleware('permission:unit-delete');
Route::get('/all_units', [App\Http\Controllers\UnitController::class,'all_units']);
Route::post('/unit/seed-defaults', [App\Http\Controllers\UnitController::class, 'seedDefaults']);

Route::get('/ProductInformation', [App\Http\Controllers\ProductInformationController::class, 'index'])->middleware('permission:productinformation-list|productinformation-create|productinformation-edit|productinformation-delete');
Route::get('/ProductInformation/{id}', [App\Http\Controllers\ProductInformationController::class, 'show'])->middleware('permission:productinformation-list|productinformation-create|productinformation-edit|productinformation-delete');
Route::get('/search_ProductInformation/{search_term}', [App\Http\Controllers\ProductInformationController::class, 'search']);
Route::post('/ProductInformation', [App\Http\Controllers\ProductInformationController::class, 'store'])->middleware('permission:productinformation-create');
Route::put('/ProductInformation/{id}', [App\Http\Controllers\ProductInformationController::class, 'update'])->middleware('permission:productinformation-edit');
Route::delete('/ProductInformation/{id}', [App\Http\Controllers\ProductInformationController::class, 'destroy'])->middleware('permission:productinformation-delete');
Route::get('/all_productInformations', [App\Http\Controllers\ProductInformationController::class,'all_productInformations']);


Route::get('/product', [App\Http\Controllers\ProductController::class, 'index'])->middleware('permission:product-list|product-create|product-edit|product-delete');
Route::get('/product/{id}', [App\Http\Controllers\ProductController::class, 'show'])->middleware('permission:product-list|product-create|product-edit|product-delete');
Route::get('/search_product/{search_term}', [App\Http\Controllers\ProductController::class, 'search'])->middleware('permission:product-list|product-create|product-edit|product-delete');
Route::post('/product', [App\Http\Controllers\ProductController::class, 'store'])->middleware('permission:product-create');
Route::put('/product/{id}', [App\Http\Controllers\ProductController::class, 'update'])->middleware('permission:product-edit');
Route::delete('/product/{id}', [App\Http\Controllers\ProductController::class, 'destroy'])->middleware('permission:product-delete');
Route::get('/all_products', [App\Http\Controllers\ProductController::class,'all_products']);


Route::get('/productimage', [App\Http\Controllers\ProductimageController::class, 'index'])->middleware('permission:productimage-list|productimage-create|productimage-edit|productimage-delete');
Route::get('/productimage/{id}', [App\Http\Controllers\ProductimageController::class, 'show'])->middleware('permission:productimage-list|productimage-create|productimage-edit|productimage-delete');
Route::get('/search_productimage/{search_term}', [App\Http\Controllers\ProductimageController::class, 'search'])->middleware('permission:productimage-list|productimage-create|productimage-edit|productimage-delete');
Route::post('/productimage', [App\Http\Controllers\ProductimageController::class, 'store'])->middleware('permission:productimage-create');
Route::put('/productimage/{id}', [App\Http\Controllers\ProductimageController::class, 'update'])->middleware('permission:productimage-edit');
Route::delete('/productimage/{id}', [App\Http\Controllers\ProductimageController::class, 'destroy'])->middleware('permission:productimage-delete');
Route::get('/all_productimages', [App\Http\Controllers\ProductimageController::class,'all_productimages']);


Route::get('/crosscode', [App\Http\Controllers\CrosscodeController::class, 'index'])->middleware('permission:crosscode-list|crosscode-create|crosscode-edit|crosscode-delete');
Route::get('/crosscode/{id}', [App\Http\Controllers\CrosscodeController::class, 'show'])->middleware('permission:crosscode-list|crosscode-create|crosscode-edit|crosscode-delete');
Route::get('/search_crosscode/{search_term}', [App\Http\Controllers\CrosscodeController::class, 'search'])->middleware('permission:crosscode-list|crosscode-create|crosscode-edit|crosscode-delete');
Route::post('/crosscode', [App\Http\Controllers\CrosscodeController::class, 'store'])->middleware('permission:crosscode-create');
Route::put('/crosscode/{id}', [App\Http\Controllers\CrosscodeController::class, 'update'])->middleware('permission:crosscode-edit');
Route::delete('/crosscode/{id}', [App\Http\Controllers\CrosscodeController::class, 'destroy'])->middleware('permission:crosscode-delete');
Route::get('/all_crosscodes', [App\Http\Controllers\CrosscodeController::class,'all_crosscodes']);


Route::get('/crosscar', [App\Http\Controllers\CrosscarController::class, 'index'])->middleware('permission:crosscar-list|crosscar-create|crosscar-edit|crosscar-delete');
Route::get('/crosscar/{id}', [App\Http\Controllers\CrosscarController::class, 'show'])->middleware('permission:crosscar-list|crosscar-create|crosscar-edit|crosscar-delete');
Route::get('/search_crosscar/{search_term}', [App\Http\Controllers\CrosscarController::class, 'search'])->middleware('permission:crosscar-list|crosscar-create|crosscar-edit|crosscar-delete');
Route::post('/crosscar', [App\Http\Controllers\CrosscarController::class, 'store'])->middleware('permission:crosscar-create');
Route::put('/crosscar/{id}', [App\Http\Controllers\CrosscarController::class, 'update'])->middleware('permission:crosscar-edit');
Route::delete('/crosscar/{id}', [App\Http\Controllers\CrosscarController::class, 'destroy'])->middleware('permission:crosscar-delete');
Route::get('/all_crosscars', [App\Http\Controllers\CrosscarController::class,'all_crosscars']);


Route::get('/productspecification', [App\Http\Controllers\ProductspecificationController::class, 'index'])->middleware('permission:productspecification-list|productspecification-create|productspecification-edit|productspecification-delete');
Route::get('/productspecification/{id}', [App\Http\Controllers\ProductspecificationController::class, 'show'])->middleware('permission:productspecification-list|productspecification-create|productspecification-edit|productspecification-delete');
Route::get('/search_productspecification/{search_term}', [App\Http\Controllers\ProductspecificationController::class, 'search'])->middleware('permission:productspecification-list|productspecification-create|productspecification-edit|productspecification-delete');
Route::post('/productspecification', [App\Http\Controllers\ProductspecificationController::class, 'store'])->middleware('permission:productspecification-create');
Route::put('/productspecification/{id}', [App\Http\Controllers\ProductspecificationController::class, 'update'])->middleware('permission:productspecification-edit');
Route::delete('/productspecification/{id}', [App\Http\Controllers\ProductspecificationController::class, 'destroy'])->middleware('permission:productspecification-delete');
Route::get('/all_productspecifications', [App\Http\Controllers\ProductspecificationController::class,'all_productspecifications']);


Route::get('/exchangerate', [App\Http\Controllers\ExchangerateController::class, 'index'])->middleware('permission:exchangerate-list|exchangerate-create|exchangerate-edit|exchangerate-delete');
Route::get('/exchangerate/{id}', [App\Http\Controllers\ExchangerateController::class, 'show'])->middleware('permission:exchangerate-list|exchangerate-create|exchangerate-edit|exchangerate-delete');
Route::get('/search_exchangerate/{search_term}', [App\Http\Controllers\ExchangerateController::class, 'search'])->middleware('permission:exchangerate-list|exchangerate-create|exchangerate-edit|exchangerate-delete');
Route::post('/exchangerate', [App\Http\Controllers\ExchangerateController::class, 'store'])->middleware('permission:exchangerate-create');
Route::put('/exchangerate/{id}', [App\Http\Controllers\ExchangerateController::class, 'update'])->middleware('permission:exchangerate-edit');
Route::delete('/exchangerate/{id}', [App\Http\Controllers\ExchangerateController::class, 'destroy'])->middleware('permission:exchangerate-delete');
Route::get('/all_exchangerates', [App\Http\Controllers\ExchangerateController::class,'all_exchangerates']);


Route::get('/compan', [App\Http\Controllers\CompanController::class, 'index'])->middleware('permission:compan-list|compan-create|compan-edit|compan-delete');
Route::get('/compan/{id}', [App\Http\Controllers\CompanController::class, 'show'])->middleware('permission:compan-list|compan-create|compan-edit|compan-delete');
Route::get('/search_compan/{search_term}', [App\Http\Controllers\CompanController::class, 'search'])->middleware('permission:compan-list|compan-create|compan-edit|compan-delete');
Route::post('/compan', [App\Http\Controllers\CompanController::class, 'store'])->middleware('permission:compan-create');
Route::put('/compan/{id}', [App\Http\Controllers\CompanController::class, 'update'])->middleware('permission:compan-edit');
Route::delete('/compan/{id}', [App\Http\Controllers\CompanController::class, 'destroy'])->middleware('permission:compan-delete');
Route::get('/all_compans', [App\Http\Controllers\CompanController::class,'all_compans']);


Route::get('/basket', [App\Http\Controllers\BasketController::class, 'index'])->middleware('permission:basket-list|basket-create|basket-edit|basket-delete');
Route::get('/basket/{id}', [App\Http\Controllers\BasketController::class, 'show'])->middleware('permission:basket-list|basket-create|basket-edit|basket-delete');
Route::get('/search_basket/{search_term}', [App\Http\Controllers\BasketController::class, 'search'])->middleware('permission:basket-list|basket-create|basket-edit|basket-delete');
Route::post('/basket', [App\Http\Controllers\BasketController::class, 'store'])->middleware('permission:basket-create');
Route::put('/basket/{id}', [App\Http\Controllers\BasketController::class, 'update'])->middleware('permission:basket-edit');
Route::delete('/basket/{id}', [App\Http\Controllers\BasketController::class, 'destroy'])->middleware('permission:basket-delete');
Route::get('/all_baskets', [App\Http\Controllers\BasketController::class,'all_baskets']);


Route::get('/basketfile', [App\Http\Controllers\BasketfileController::class, 'index'])->middleware('permission:basketfile-list|basketfile-create|basketfile-edit|basketfile-delete');
Route::get('/basketfile/{id}', [App\Http\Controllers\BasketfileController::class, 'show'])->middleware('permission:basketfile-list|basketfile-create|basketfile-edit|basketfile-delete');
Route::get('/search_basketfile/{search_term}', [App\Http\Controllers\BasketfileController::class, 'search'])->middleware('permission:basketfile-list|basketfile-create|basketfile-edit|basketfile-delete');
Route::post('/basketfile', [App\Http\Controllers\BasketfileController::class, 'store'])->middleware('permission:basketfile-create');
Route::put('/basketfile/{id}', [App\Http\Controllers\BasketfileController::class, 'update'])->middleware('permission:basketfile-edit');
Route::delete('/basketfile/{id}', [App\Http\Controllers\BasketfileController::class, 'destroy'])->middleware('permission:basketfile-delete');
Route::get('/all_basketfiles', [App\Http\Controllers\BasketfileController::class,'all_basketfiles']);


Route::get('/basketitem', [App\Http\Controllers\BasketitemController::class, 'index'])->middleware('permission:basketitem-list|basketitem-create|basketitem-edit|basketitem-delete');
Route::get('/basketitem/{id}', [App\Http\Controllers\BasketitemController::class, 'show'])->middleware('permission:basketitem-list|basketitem-create|basketitem-edit|basketitem-delete');
Route::get('/search_basketitem/{search_term}', [App\Http\Controllers\BasketitemController::class, 'search'])->middleware('permission:basketitem-list|basketitem-create|basketitem-edit|basketitem-delete');
Route::post('/basketitem', [App\Http\Controllers\BasketitemController::class, 'store'])->middleware('permission:basketitem-create');
Route::put('/basketitem/{id}', [App\Http\Controllers\BasketitemController::class, 'update'])->middleware('permission:basketitem-edit');
Route::delete('/basketitem/{id}', [App\Http\Controllers\BasketitemController::class, 'destroy'])->middleware('permission:basketitem-delete');
Route::get('/all_basketitems', [App\Http\Controllers\BasketitemController::class,'all_basketitems']);


Route::get('/order', [App\Http\Controllers\OrderController::class, 'index'])->middleware('permission:order-list|order-create|order-edit|order-delete');
Route::get('/order/{id}', [App\Http\Controllers\OrderController::class, 'show'])->middleware('permission:order-list|order-create|order-edit|order-delete');
Route::get('/search_order/{search_term}', [App\Http\Controllers\OrderController::class, 'search'])->middleware('permission:order-list|order-create|order-edit|order-delete');
Route::post('/order', [App\Http\Controllers\OrderController::class, 'store'])->middleware('permission:order-create');
Route::put('/order/{id}', [App\Http\Controllers\OrderController::class, 'update'])->middleware('permission:order-edit');
Route::delete('/order/{id}', [App\Http\Controllers\OrderController::class, 'destroy'])->middleware('permission:order-delete');
Route::get('/all_orders', [App\Http\Controllers\OrderController::class,'all_orders']);


Route::get('/orderdetail', [App\Http\Controllers\OrderdetailController::class, 'index'])->middleware('permission:orderdetail-list|orderdetail-create|orderdetail-edit|orderdetail-delete');
Route::get('/orderdetail/{id}', [App\Http\Controllers\OrderdetailController::class, 'show'])->middleware('permission:orderdetail-list|orderdetail-create|orderdetail-edit|orderdetail-delete');
Route::get('/search_orderdetail/{search_term}', [App\Http\Controllers\OrderdetailController::class, 'search'])->middleware('permission:orderdetail-list|orderdetail-create|orderdetail-edit|orderdetail-delete');
Route::post('/orderdetail', [App\Http\Controllers\OrderdetailController::class, 'store'])->middleware('permission:orderdetail-create');
Route::put('/orderdetail/{id}', [App\Http\Controllers\OrderdetailController::class, 'update'])->middleware('permission:orderdetail-edit');
Route::delete('/orderdetail/{id}', [App\Http\Controllers\OrderdetailController::class, 'destroy'])->middleware('permission:orderdetail-delete');
Route::get('/all_orderdetails', [App\Http\Controllers\OrderdetailController::class,'all_orderdetails']);


Route::get('/supplierorder', [App\Http\Controllers\SupplierorderController::class, 'index'])->middleware('permission:supplierorder-list|supplierorder-create|supplierorder-edit|supplierorder-delete');
Route::get('/supplierorder/{id}', [App\Http\Controllers\SupplierorderController::class, 'show'])->middleware('permission:supplierorder-list|supplierorder-create|supplierorder-edit|supplierorder-delete');
Route::get('/search_supplierorder/{search_term}', [App\Http\Controllers\SupplierorderController::class, 'search'])->middleware('permission:supplierorder-list|supplierorder-create|supplierorder-edit|supplierorder-delete');
Route::post('/supplierorder', [App\Http\Controllers\SupplierorderController::class, 'store'])->middleware('permission:supplierorder-create');
Route::put('/supplierorder/{id}', [App\Http\Controllers\SupplierorderController::class, 'update'])->middleware('permission:supplierorder-edit');
Route::delete('/supplierorder/{id}', [App\Http\Controllers\SupplierorderController::class, 'destroy'])->middleware('permission:supplierorder-delete');
Route::get('/all_supplierorders', [App\Http\Controllers\SupplierorderController::class,'all_supplierorders']);


Route::get('/supplierorderdetail', [App\Http\Controllers\SupplierorderdetailController::class, 'index'])->middleware('permission:supplierorderdetail-list|supplierorderdetail-create|supplierorderdetail-edit|supplierorderdetail-delete');
Route::get('/supplierorderdetail/{id}', [App\Http\Controllers\SupplierorderdetailController::class, 'show'])->middleware('permission:supplierorderdetail-list|supplierorderdetail-create|supplierorderdetail-edit|supplierorderdetail-delete');
Route::get('/search_supplierorderdetail/{search_term}', [App\Http\Controllers\SupplierorderdetailController::class, 'search'])->middleware('permission:supplierorderdetail-list|supplierorderdetail-create|supplierorderdetail-edit|supplierorderdetail-delete');
Route::post('/supplierorderdetail', [App\Http\Controllers\SupplierorderdetailController::class, 'store'])->middleware('permission:supplierorderdetail-create');
Route::put('/supplierorderdetail/{id}', [App\Http\Controllers\SupplierorderdetailController::class, 'update'])->middleware('permission:supplierorderdetail-edit');
Route::delete('/supplierorderdetail/{id}', [App\Http\Controllers\SupplierorderdetailController::class, 'destroy'])->middleware('permission:supplierorderdetail-delete');
Route::get('/all_supplierorderdetails', [App\Http\Controllers\SupplierorderdetailController::class,'all_supplierorderdetails']);


Route::get('/packagin', [App\Http\Controllers\PackaginController::class, 'index'])->middleware('permission:packagin-list|packagin-create|packagin-edit|packagin-delete');
Route::get('/packagin/{id}', [App\Http\Controllers\PackaginController::class, 'show'])->middleware('permission:packagin-list|packagin-create|packagin-edit|packagin-delete');
Route::get('/search_packagin/{search_term}', [App\Http\Controllers\PackaginController::class, 'search'])->middleware('permission:packagin-list|packagin-create|packagin-edit|packagin-delete');
Route::post('/packagin', [App\Http\Controllers\PackaginController::class, 'store'])->middleware('permission:packagin-create');
Route::put('/packagin/{id}', [App\Http\Controllers\PackaginController::class, 'update'])->middleware('permission:packagin-edit');
Route::delete('/packagin/{id}', [App\Http\Controllers\PackaginController::class, 'destroy'])->middleware('permission:packagin-delete');
Route::get('/all_packagins', [App\Http\Controllers\PackaginController::class,'all_packagins']);


Route::get('/packinglist', [App\Http\Controllers\PackinglistController::class, 'index'])->middleware('permission:packinglist-list|packinglist-create|packinglist-edit|packinglist-delete');
Route::get('/packinglist/{id}', [App\Http\Controllers\PackinglistController::class, 'show'])->middleware('permission:packinglist-list|packinglist-create|packinglist-edit|packinglist-delete');
Route::get('/search_packinglist/{search_term}', [App\Http\Controllers\PackinglistController::class, 'search'])->middleware('permission:packinglist-list|packinglist-create|packinglist-edit|packinglist-delete');
Route::post('/packinglist', [App\Http\Controllers\PackinglistController::class, 'store'])->middleware('permission:packinglist-create');
Route::put('/packinglist/{id}', [App\Http\Controllers\PackinglistController::class, 'update'])->middleware('permission:packinglist-edit');
Route::delete('/packinglist/{id}', [App\Http\Controllers\PackinglistController::class, 'destroy'])->middleware('permission:packinglist-delete');
Route::get('/all_packinglists', [App\Http\Controllers\PackinglistController::class,'all_packinglists']);


Route::get('/packinglistbox', [App\Http\Controllers\PackinglistboxController::class, 'index'])->middleware('permission:packinglistbox-list|packinglistbox-create|packinglistbox-edit|packinglistbox-delete');
Route::get('/packinglistbox/{id}', [App\Http\Controllers\PackinglistboxController::class, 'show'])->middleware('permission:packinglistbox-list|packinglistbox-create|packinglistbox-edit|packinglistbox-delete');
Route::get('/search_packinglistbox/{search_term}', [App\Http\Controllers\PackinglistboxController::class, 'search'])->middleware('permission:packinglistbox-list|packinglistbox-create|packinglistbox-edit|packinglistbox-delete');
Route::post('/packinglistbox', [App\Http\Controllers\PackinglistboxController::class, 'store'])->middleware('permission:packinglistbox-create');
Route::put('/packinglistbox/{id}', [App\Http\Controllers\PackinglistboxController::class, 'update'])->middleware('permission:packinglistbox-edit');
Route::delete('/packinglistbox/{id}', [App\Http\Controllers\PackinglistboxController::class, 'destroy'])->middleware('permission:packinglistbox-delete');
Route::get('/all_packinglistboxs', [App\Http\Controllers\PackinglistboxController::class,'all_packinglistboxs']);


Route::get('/packinglistboxitem', [App\Http\Controllers\PackinglistboxitemController::class, 'index'])->middleware('permission:packinglistboxitem-list|packinglistboxitem-create|packinglistboxitem-edit|packinglistboxitem-delete');
Route::get('/packinglistboxitem/{id}', [App\Http\Controllers\PackinglistboxitemController::class, 'show'])->middleware('permission:packinglistboxitem-list|packinglistboxitem-create|packinglistboxitem-edit|packinglistboxitem-delete');
Route::get('/search_packinglistboxitem/{search_term}', [App\Http\Controllers\PackinglistboxitemController::class, 'search'])->middleware('permission:packinglistboxitem-list|packinglistboxitem-create|packinglistboxitem-edit|packinglistboxitem-delete');
Route::post('/packinglistboxitem', [App\Http\Controllers\PackinglistboxitemController::class, 'store'])->middleware('permission:packinglistboxitem-create');
Route::put('/packinglistboxitem/{id}', [App\Http\Controllers\PackinglistboxitemController::class, 'update'])->middleware('permission:packinglistboxitem-edit');
Route::delete('/packinglistboxitem/{id}', [App\Http\Controllers\PackinglistboxitemController::class, 'destroy'])->middleware('permission:packinglistboxitem-delete');
Route::get('/all_packinglistboxitems', [App\Http\Controllers\PackinglistboxitemController::class,'all_packinglistboxitems']);


Route::get('/attachment', [App\Http\Controllers\AttachmentController::class, 'index'])->middleware('permission:attachment-list|attachment-create|attachment-edit|attachment-delete');
Route::get('/attachment/{id}', [App\Http\Controllers\AttachmentController::class, 'show'])->middleware('permission:attachment-list|attachment-create|attachment-edit|attachment-delete');
Route::get('/search_attachment/{search_term}', [App\Http\Controllers\AttachmentController::class, 'search'])->middleware('permission:attachment-list|attachment-create|attachment-edit|attachment-delete');
Route::post('/attachment', [App\Http\Controllers\AttachmentController::class, 'store'])->middleware('permission:attachment-create');
Route::put('/attachment/{id}', [App\Http\Controllers\AttachmentController::class, 'update'])->middleware('permission:attachment-edit');
Route::delete('/attachment/{id}', [App\Http\Controllers\AttachmentController::class, 'destroy'])->middleware('permission:attachment-delete');
Route::get('/all_attachments', [App\Http\Controllers\AttachmentController::class,'all_attachments']);


Route::get('/problem', [App\Http\Controllers\ProblemController::class, 'index'])->middleware('permission:problem-list|problem-create|problem-edit|problem-delete');
Route::get('/problem/{id}', [App\Http\Controllers\ProblemController::class, 'show'])->middleware('permission:problem-list|problem-create|problem-edit|problem-delete');
Route::get('/search_problem/{search_term}', [App\Http\Controllers\ProblemController::class, 'search'])->middleware('permission:problem-list|problem-create|problem-edit|problem-delete');
Route::post('/problem', [App\Http\Controllers\ProblemController::class, 'store'])->middleware('permission:problem-create');
Route::put('/problem/{id}', [App\Http\Controllers\ProblemController::class, 'update'])->middleware('permission:problem-edit');
Route::delete('/problem/{id}', [App\Http\Controllers\ProblemController::class, 'destroy'])->middleware('permission:problem-delete');
Route::get('/all_problems', [App\Http\Controllers\ProblemController::class,'all_problems']);


Route::get('/problemitem', [App\Http\Controllers\ProblemitemController::class, 'index'])->middleware('permission:problemitem-list|problemitem-create|problemitem-edit|problemitem-delete');
Route::get('/problemitem/{id}', [App\Http\Controllers\ProblemitemController::class, 'show'])->middleware('permission:problemitem-list|problemitem-create|problemitem-edit|problemitem-delete');
Route::get('/search_problemitem/{search_term}', [App\Http\Controllers\ProblemitemController::class, 'search'])->middleware('permission:problemitem-list|problemitem-create|problemitem-edit|problemitem-delete');
Route::post('/problemitem', [App\Http\Controllers\ProblemitemController::class, 'store'])->middleware('permission:problemitem-create');
Route::put('/problemitem/{id}', [App\Http\Controllers\ProblemitemController::class, 'update'])->middleware('permission:problemitem-edit');
Route::delete('/problemitem/{id}', [App\Http\Controllers\ProblemitemController::class, 'destroy'])->middleware('permission:problemitem-delete');
Route::get('/all_problemitems', [App\Http\Controllers\ProblemitemController::class,'all_problemitems']);


Route::get('/productstatus', [App\Http\Controllers\ProductstatusController::class, 'index'])->middleware('permission:productstatus-list|productstatus-create|productstatus-edit|productstatus-delete');
Route::get('/productstatus/{id}', [App\Http\Controllers\ProductstatusController::class, 'show'])->middleware('permission:productstatus-list|productstatus-create|productstatus-edit|productstatus-delete');
Route::get('/search_productstatus/{search_term}', [App\Http\Controllers\ProductstatusController::class, 'search'])->middleware('permission:productstatus-list|productstatus-create|productstatus-edit|productstatus-delete');
Route::post('/productstatus', [App\Http\Controllers\ProductstatusController::class, 'store'])->middleware('permission:productstatus-create');
Route::put('/productstatus/{id}', [App\Http\Controllers\ProductstatusController::class, 'update'])->middleware('permission:productstatus-edit');
Route::delete('/productstatus/{id}', [App\Http\Controllers\ProductstatusController::class, 'destroy'])->middleware('permission:productstatus-delete');
Route::get('/all_productstatuss', [App\Http\Controllers\ProductstatusController::class,'all_productstatuss']);


Route::get('/customerinvoice', [App\Http\Controllers\CustomerinvoiceController::class, 'index'])->middleware('permission:customerinvoice-list|customerinvoice-create|customerinvoice-edit|customerinvoice-delete');
Route::get('/customerinvoice/{id}', [App\Http\Controllers\CustomerinvoiceController::class, 'show'])->middleware('permission:customerinvoice-list|customerinvoice-create|customerinvoice-edit|customerinvoice-delete');
Route::get('/search_customerinvoice/{search_term}', [App\Http\Controllers\CustomerinvoiceController::class, 'search'])->middleware('permission:customerinvoice-list|customerinvoice-create|customerinvoice-edit|customerinvoice-delete');
Route::post('/customerinvoice', [App\Http\Controllers\CustomerinvoiceController::class, 'store'])->middleware('permission:customerinvoice-create');
Route::put('/customerinvoice/{id}', [App\Http\Controllers\CustomerinvoiceController::class, 'update'])->middleware('permission:customerinvoice-edit');
Route::delete('/customerinvoice/{id}', [App\Http\Controllers\CustomerinvoiceController::class, 'destroy'])->middleware('permission:customerinvoice-delete');
Route::get('/all_customerinvoices', [App\Http\Controllers\CustomerinvoiceController::class,'all_customerinvoices']);


Route::get('/warehouse', [App\Http\Controllers\WarehouseController::class, 'index'])->middleware('permission:warehouse-list|warehouse-create|warehouse-edit|warehouse-delete');
Route::get('/warehouse/{id}', [App\Http\Controllers\WarehouseController::class, 'show'])->middleware('permission:warehouse-list|warehouse-create|warehouse-edit|warehouse-delete');
Route::get('/search_warehouse/{search_term}', [App\Http\Controllers\WarehouseController::class, 'search'])->middleware('permission:warehouse-list|warehouse-create|warehouse-edit|warehouse-delete');
Route::post('/warehouse', [App\Http\Controllers\WarehouseController::class, 'store'])->middleware('permission:warehouse-create');
Route::put('/warehouse/{id}', [App\Http\Controllers\WarehouseController::class, 'update'])->middleware('permission:warehouse-edit');
Route::delete('/warehouse/{id}', [App\Http\Controllers\WarehouseController::class, 'destroy'])->middleware('permission:warehouse-delete');
Route::get('/all_warehouses', [App\Http\Controllers\WarehouseController::class,'all_warehouses']);


Route::get('/customerinvoiceitem', [App\Http\Controllers\CustomerinvoiceitemController::class, 'index'])->middleware('permission:customerinvoiceitem-list|customerinvoiceitem-create|customerinvoiceitem-edit|customerinvoiceitem-delete');
Route::get('/customerinvoiceitem/{id}', [App\Http\Controllers\CustomerinvoiceitemController::class, 'show'])->middleware('permission:customerinvoiceitem-list|customerinvoiceitem-create|customerinvoiceitem-edit|customerinvoiceitem-delete');
Route::get('/search_customerinvoiceitem/{search_term}', [App\Http\Controllers\CustomerinvoiceitemController::class, 'search'])->middleware('permission:customerinvoiceitem-list|customerinvoiceitem-create|customerinvoiceitem-edit|customerinvoiceitem-delete');
Route::post('/customerinvoiceitem', [App\Http\Controllers\CustomerinvoiceitemController::class, 'store'])->middleware('permission:customerinvoiceitem-create');
Route::put('/customerinvoiceitem/{id}', [App\Http\Controllers\CustomerinvoiceitemController::class, 'update'])->middleware('permission:customerinvoiceitem-edit');
Route::delete('/customerinvoiceitem/{id}', [App\Http\Controllers\CustomerinvoiceitemController::class, 'destroy'])->middleware('permission:customerinvoiceitem-delete');
Route::get('/all_customerinvoiceitems', [App\Http\Controllers\CustomerinvoiceitemController::class,'all_customerinvoiceitems']);


Route::get('/supplierinvoice', [App\Http\Controllers\SupplierinvoiceController::class, 'index'])->middleware('permission:supplierinvoice-list|supplierinvoice-create|supplierinvoice-edit|supplierinvoice-delete');
Route::get('/supplierinvoice/{id}', [App\Http\Controllers\SupplierinvoiceController::class, 'show'])->middleware('permission:supplierinvoice-list|supplierinvoice-create|supplierinvoice-edit|supplierinvoice-delete');
Route::get('/search_supplierinvoice/{search_term}', [App\Http\Controllers\SupplierinvoiceController::class, 'search'])->middleware('permission:supplierinvoice-list|supplierinvoice-create|supplierinvoice-edit|supplierinvoice-delete');
Route::post('/supplierinvoice', [App\Http\Controllers\SupplierinvoiceController::class, 'store'])->middleware('permission:supplierinvoice-create');
Route::put('/supplierinvoice/{id}', [App\Http\Controllers\SupplierinvoiceController::class, 'update'])->middleware('permission:supplierinvoice-edit');
Route::delete('/supplierinvoice/{id}', [App\Http\Controllers\SupplierinvoiceController::class, 'destroy'])->middleware('permission:supplierinvoice-delete');
Route::get('/all_supplierinvoices', [App\Http\Controllers\SupplierinvoiceController::class,'all_supplierinvoices']);


Route::get('/supplierinvoiceitem', [App\Http\Controllers\SupplierinvoiceitemController::class, 'index'])->middleware('permission:supplierinvoiceitem-list|supplierinvoiceitem-create|supplierinvoiceitem-edit|supplierinvoiceitem-delete');
Route::get('/supplierinvoiceitem/{id}', [App\Http\Controllers\SupplierinvoiceitemController::class, 'show'])->middleware('permission:supplierinvoiceitem-list|supplierinvoiceitem-create|supplierinvoiceitem-edit|supplierinvoiceitem-delete');
Route::get('/search_supplierinvoiceitem/{search_term}', [App\Http\Controllers\SupplierinvoiceitemController::class, 'search'])->middleware('permission:supplierinvoiceitem-list|supplierinvoiceitem-create|supplierinvoiceitem-edit|supplierinvoiceitem-delete');
Route::post('/supplierinvoiceitem', [App\Http\Controllers\SupplierinvoiceitemController::class, 'store'])->middleware('permission:supplierinvoiceitem-create');
Route::put('/supplierinvoiceitem/{id}', [App\Http\Controllers\SupplierinvoiceitemController::class, 'update'])->middleware('permission:supplierinvoiceitem-edit');
Route::delete('/supplierinvoiceitem/{id}', [App\Http\Controllers\SupplierinvoiceitemController::class, 'destroy'])->middleware('permission:supplierinvoiceitem-delete');
Route::get('/all_supplierinvoiceitems', [App\Http\Controllers\SupplierinvoiceitemController::class,'all_supplierinvoiceitems']);


Route::get('/accounttype', [App\Http\Controllers\AccounttypeController::class, 'index'])->middleware('permission:accounttype-list|accounttype-create|accounttype-edit|accounttype-delete');
Route::get('/accounttype/{id}', [App\Http\Controllers\AccounttypeController::class, 'show'])->middleware('permission:accounttype-list|accounttype-create|accounttype-edit|accounttype-delete');
Route::get('/search_accounttype/{search_term}', [App\Http\Controllers\AccounttypeController::class, 'search'])->middleware('permission:accounttype-list|accounttype-create|accounttype-edit|accounttype-delete');
Route::post('/accounttype', [App\Http\Controllers\AccounttypeController::class, 'store'])->middleware('permission:accounttype-create');
Route::put('/accounttype/{id}', [App\Http\Controllers\AccounttypeController::class, 'update'])->middleware('permission:accounttype-edit');
Route::delete('/accounttype/{id}', [App\Http\Controllers\AccounttypeController::class, 'destroy'])->middleware('permission:accounttype-delete');
Route::get('/all_accounttypes', [App\Http\Controllers\AccounttypeController::class,'all_accounttypes']);


Route::get('/paymentnote', [App\Http\Controllers\PaymentnoteController::class, 'index'])->middleware('permission:paymentnote-list|paymentnote-create|paymentnote-edit|paymentnote-delete');
Route::get('/paymentnote/{id}', [App\Http\Controllers\PaymentnoteController::class, 'show'])->middleware('permission:paymentnote-list|paymentnote-create|paymentnote-edit|paymentnote-delete');
Route::get('/search_paymentnote/{search_term}', [App\Http\Controllers\PaymentnoteController::class, 'search'])->middleware('permission:paymentnote-list|paymentnote-create|paymentnote-edit|paymentnote-delete');
Route::post('/paymentnote', [App\Http\Controllers\PaymentnoteController::class, 'store'])->middleware('permission:paymentnote-create');
Route::put('/paymentnote/{id}', [App\Http\Controllers\PaymentnoteController::class, 'update'])->middleware('permission:paymentnote-edit');
Route::delete('/paymentnote/{id}', [App\Http\Controllers\PaymentnoteController::class, 'destroy'])->middleware('permission:paymentnote-delete');
Route::get('/all_paymentnotes', [App\Http\Controllers\PaymentnoteController::class,'all_paymentnotes']);


Route::get('/productrule', [App\Http\Controllers\ProductruleController::class, 'index'])->middleware('permission:productrule-list|productrule-create|productrule-edit|productrule-delete');
Route::get('/productrule/{id}', [App\Http\Controllers\ProductruleController::class, 'show'])->middleware('permission:productrule-list|productrule-create|productrule-edit|productrule-delete');
Route::get('/search_productrule/{search_term}', [App\Http\Controllers\ProductruleController::class, 'search'])->middleware('permission:productrule-list|productrule-create|productrule-edit|productrule-delete');
Route::post('/productrule', [App\Http\Controllers\ProductruleController::class, 'store'])->middleware('permission:productrule-create');
Route::put('/productrule/{id}', [App\Http\Controllers\ProductruleController::class, 'update'])->middleware('permission:productrule-edit');
Route::delete('/productrule/{id}', [App\Http\Controllers\ProductruleController::class, 'destroy'])->middleware('permission:productrule-delete');
Route::get('/all_productrules', [App\Http\Controllers\ProductruleController::class,'all_productrules']);


Route::get('/packagingproblem', [App\Http\Controllers\PackagingproblemController::class, 'index'])->middleware('permission:packagingproblem-list|packagingproblem-create|packagingproblem-edit|packagingproblem-delete');
Route::get('/packagingproblem/{id}', [App\Http\Controllers\PackagingproblemController::class, 'show'])->middleware('permission:packagingproblem-list|packagingproblem-create|packagingproblem-edit|packagingproblem-delete');
Route::get('/search_packagingproblem/{search_term}', [App\Http\Controllers\PackagingproblemController::class, 'search'])->middleware('permission:packagingproblem-list|packagingproblem-create|packagingproblem-edit|packagingproblem-delete');
Route::post('/packagingproblem', [App\Http\Controllers\PackagingproblemController::class, 'store'])->middleware('permission:packagingproblem-create');
Route::put('/packagingproblem/{id}', [App\Http\Controllers\PackagingproblemController::class, 'update'])->middleware('permission:packagingproblem-edit');
Route::delete('/packagingproblem/{id}', [App\Http\Controllers\PackagingproblemController::class, 'destroy'])->middleware('permission:packagingproblem-delete');
Route::get('/all_packagingproblems', [App\Http\Controllers\PackagingproblemController::class,'all_packagingproblems']);


Route::get('/searchresult', [App\Http\Controllers\SearchresultController::class, 'index'])->middleware('permission:searchresult-list|searchresult-create|searchresult-edit|searchresult-delete');
Route::get('/searchresult/{id}', [App\Http\Controllers\SearchresultController::class, 'show'])->middleware('permission:searchresult-list|searchresult-create|searchresult-edit|searchresult-delete');
Route::get('/search_searchresult/{search_term}', [App\Http\Controllers\SearchresultController::class, 'search'])->middleware('permission:searchresult-list|searchresult-create|searchresult-edit|searchresult-delete');
Route::post('/searchresult', [App\Http\Controllers\SearchresultController::class, 'store'])->middleware('permission:searchresult-create');
Route::put('/searchresult/{id}', [App\Http\Controllers\SearchresultController::class, 'update'])->middleware('permission:searchresult-edit');
Route::delete('/searchresult/{id}', [App\Http\Controllers\SearchresultController::class, 'destroy'])->middleware('permission:searchresult-delete');
Route::get('/all_searchresults', [App\Http\Controllers\SearchresultController::class,'all_searchresults']);


Route::get('/fileoperation', [App\Http\Controllers\FileoperationController::class, 'index'])->middleware('permission:fileoperation-list|fileoperation-create|fileoperation-edit|fileoperation-delete');
Route::get('/fileoperation/{id}', [App\Http\Controllers\FileoperationController::class, 'show'])->middleware('permission:fileoperation-list|fileoperation-create|fileoperation-edit|fileoperation-delete');
Route::get('/search_fileoperation/{search_term}', [App\Http\Controllers\FileoperationController::class, 'search'])->middleware('permission:fileoperation-list|fileoperation-create|fileoperation-edit|fileoperation-delete');
Route::post('/fileoperation', [App\Http\Controllers\FileoperationController::class, 'store'])->middleware('permission:fileoperation-create');
Route::put('/fileoperation/{id}', [App\Http\Controllers\FileoperationController::class, 'update'])->middleware('permission:fileoperation-edit');
Route::delete('/fileoperation/{id}', [App\Http\Controllers\FileoperationController::class, 'destroy'])->middleware('permission:fileoperation-delete');
Route::get('/all_fileoperations', [App\Http\Controllers\FileoperationController::class,'all_fileoperations']);


Route::get('/customerbrandvisibilit', [App\Http\Controllers\CustomerbrandvisibilitController::class, 'index'])->middleware('permission:customerbrandvisibilit-list|customerbrandvisibilit-create|customerbrandvisibilit-edit|customerbrandvisibilit-delete');
Route::get('/customerbrandvisibilit/{id}', [App\Http\Controllers\CustomerbrandvisibilitController::class, 'show'])->middleware('permission:customerbrandvisibilit-list|customerbrandvisibilit-create|customerbrandvisibilit-edit|customerbrandvisibilit-delete');
Route::get('/search_customerbrandvisibilit/{search_term}', [App\Http\Controllers\CustomerbrandvisibilitController::class, 'search'])->middleware('permission:customerbrandvisibilit-list|customerbrandvisibilit-create|customerbrandvisibilit-edit|customerbrandvisibilit-delete');
Route::post('/customerbrandvisibilit', [App\Http\Controllers\CustomerbrandvisibilitController::class, 'store'])->middleware('permission:customerbrandvisibilit-create');
Route::put('/customerbrandvisibilit/{id}', [App\Http\Controllers\CustomerbrandvisibilitController::class, 'update'])->middleware('permission:customerbrandvisibilit-edit');
Route::delete('/customerbrandvisibilit/{id}', [App\Http\Controllers\CustomerbrandvisibilitController::class, 'destroy'])->middleware('permission:customerbrandvisibilit-delete');
Route::get('/all_customerbrandvisibilits', [App\Http\Controllers\CustomerbrandvisibilitController::class,'all_customerbrandvisibilits']);


Route::get('/customerproductvisibilit', [App\Http\Controllers\CustomerproductvisibilitController::class, 'index'])->middleware('permission:customerproductvisibilit-list|customerproductvisibilit-create|customerproductvisibilit-edit|customerproductvisibilit-delete');
Route::get('/customerproductvisibilit/{id}', [App\Http\Controllers\CustomerproductvisibilitController::class, 'show'])->middleware('permission:customerproductvisibilit-list|customerproductvisibilit-create|customerproductvisibilit-edit|customerproductvisibilit-delete');
Route::get('/search_customerproductvisibilit/{search_term}', [App\Http\Controllers\CustomerproductvisibilitController::class, 'search'])->middleware('permission:customerproductvisibilit-list|customerproductvisibilit-create|customerproductvisibilit-edit|customerproductvisibilit-delete');
Route::post('/customerproductvisibilit', [App\Http\Controllers\CustomerproductvisibilitController::class, 'store'])->middleware('permission:customerproductvisibilit-create');
Route::put('/customerproductvisibilit/{id}', [App\Http\Controllers\CustomerproductvisibilitController::class, 'update'])->middleware('permission:customerproductvisibilit-edit');
Route::delete('/customerproductvisibilit/{id}', [App\Http\Controllers\CustomerproductvisibilitController::class, 'destroy'])->middleware('permission:customerproductvisibilit-delete');
Route::get('/all_customerproductvisibilits', [App\Http\Controllers\CustomerproductvisibilitController::class,'all_customerproductvisibilits']);


Route::get('/supplierpricingrule', [App\Http\Controllers\SupplierpricingruleController::class, 'index'])->middleware('permission:supplierpricingrule-list|supplierpricingrule-create|supplierpricingrule-edit|supplierpricingrule-delete');
Route::get('/supplierpricingrule/{id}', [App\Http\Controllers\SupplierpricingruleController::class, 'show'])->middleware('permission:supplierpricingrule-list|supplierpricingrule-create|supplierpricingrule-edit|supplierpricingrule-delete');
Route::get('/search_supplierpricingrule/{search_term}', [App\Http\Controllers\SupplierpricingruleController::class, 'search'])->middleware('permission:supplierpricingrule-list|supplierpricingrule-create|supplierpricingrule-edit|supplierpricingrule-delete');
Route::post('/supplierpricingrule', [App\Http\Controllers\SupplierpricingruleController::class, 'store'])->middleware('permission:supplierpricingrule-create');
Route::put('/supplierpricingrule/{id}', [App\Http\Controllers\SupplierpricingruleController::class, 'update'])->middleware('permission:supplierpricingrule-edit');
Route::delete('/supplierpricingrule/{id}', [App\Http\Controllers\SupplierpricingruleController::class, 'destroy'])->middleware('permission:supplierpricingrule-delete');
Route::get('/all_supplierpricingrules', [App\Http\Controllers\SupplierpricingruleController::class,'all_supplierpricingrules']);


Route::get('/supplierpricingrulecustomer', [App\Http\Controllers\SupplierpricingrulecustomerController::class, 'index'])->middleware('permission:supplierpricingrulecustomer-list|supplierpricingrulecustomer-create|supplierpricingrulecustomer-edit|supplierpricingrulecustomer-delete');
Route::get('/supplierpricingrulecustomer/{id}', [App\Http\Controllers\SupplierpricingrulecustomerController::class, 'show'])->middleware('permission:supplierpricingrulecustomer-list|supplierpricingrulecustomer-create|supplierpricingrulecustomer-edit|supplierpricingrulecustomer-delete');
Route::get('/search_supplierpricingrulecustomer/{search_term}', [App\Http\Controllers\SupplierpricingrulecustomerController::class, 'search'])->middleware('permission:supplierpricingrulecustomer-list|supplierpricingrulecustomer-create|supplierpricingrulecustomer-edit|supplierpricingrulecustomer-delete');
Route::post('/supplierpricingrulecustomer', [App\Http\Controllers\SupplierpricingrulecustomerController::class, 'store'])->middleware('permission:supplierpricingrulecustomer-create');
Route::put('/supplierpricingrulecustomer/{id}', [App\Http\Controllers\SupplierpricingrulecustomerController::class, 'update'])->middleware('permission:supplierpricingrulecustomer-edit');
Route::delete('/supplierpricingrulecustomer/{id}', [App\Http\Controllers\SupplierpricingrulecustomerController::class, 'destroy'])->middleware('permission:supplierpricingrulecustomer-delete');
Route::get('/all_supplierpricingrulecustomers', [App\Http\Controllers\SupplierpricingrulecustomerController::class,'all_supplierpricingrulecustomers']);


Route::get('/supplierproduct', [App\Http\Controllers\SupplierproductController::class, 'index'])->middleware('permission:supplierproduct-list|supplierproduct-create|supplierproduct-edit|supplierproduct-delete');
Route::get('/supplierproduct/{id}', [App\Http\Controllers\SupplierproductController::class, 'show'])->middleware('permission:supplierproduct-list|supplierproduct-create|supplierproduct-edit|supplierproduct-delete');
Route::get('/search_supplierproduct/{search_term}', [App\Http\Controllers\SupplierproductController::class, 'search'])->middleware('permission:supplierproduct-list|supplierproduct-create|supplierproduct-edit|supplierproduct-delete');
Route::post('/supplierproduct', [App\Http\Controllers\SupplierproductController::class, 'store'])->middleware('permission:supplierproduct-create');
Route::put('/supplierproduct/{id}', [App\Http\Controllers\SupplierproductController::class, 'update'])->middleware('permission:supplierproduct-edit');
Route::delete('/supplierproduct/{id}', [App\Http\Controllers\SupplierproductController::class, 'destroy'])->middleware('permission:supplierproduct-delete');
Route::get('/all_supplierproducts', [App\Http\Controllers\SupplierproductController::class,'all_supplierproducts']);


Route::get('/customeraccount', [App\Http\Controllers\CustomeraccountController::class, 'index'])->middleware('permission:customeraccount-list|customeraccount-create|customeraccount-edit|customeraccount-delete');
Route::get('/customeraccount/{id}', [App\Http\Controllers\CustomeraccountController::class, 'show'])->middleware('permission:customeraccount-list|customeraccount-create|customeraccount-edit|customeraccount-delete');
Route::get('/search_customeraccount/{search_term}', [App\Http\Controllers\CustomeraccountController::class, 'search'])->middleware('permission:customeraccount-list|customeraccount-create|customeraccount-edit|customeraccount-delete');
Route::post('/customeraccount', [App\Http\Controllers\CustomeraccountController::class, 'store'])->middleware('permission:customeraccount-create');
Route::put('/customeraccount/{id}', [App\Http\Controllers\CustomeraccountController::class, 'update'])->middleware('permission:customeraccount-edit');
Route::delete('/customeraccount/{id}', [App\Http\Controllers\CustomeraccountController::class, 'destroy'])->middleware('permission:customeraccount-delete');
Route::get('/all_customeraccounts', [App\Http\Controllers\CustomeraccountController::class,'all_customeraccounts']);


Route::get('/companyaccount', [App\Http\Controllers\CompanyaccountController::class, 'index'])->middleware('permission:companyaccount-list|companyaccount-create|companyaccount-edit|companyaccount-delete');
Route::get('/companyaccount/{id}', [App\Http\Controllers\CompanyaccountController::class, 'show'])->middleware('permission:companyaccount-list|companyaccount-create|companyaccount-edit|companyaccount-delete');
Route::get('/search_companyaccount/{search_term}', [App\Http\Controllers\CompanyaccountController::class, 'search'])->middleware('permission:companyaccount-list|companyaccount-create|companyaccount-edit|companyaccount-delete');
Route::post('/companyaccount', [App\Http\Controllers\CompanyaccountController::class, 'store'])->middleware('permission:companyaccount-create');
Route::put('/companyaccount/{id}', [App\Http\Controllers\CompanyaccountController::class, 'update'])->middleware('permission:companyaccount-edit');
Route::delete('/companyaccount/{id}', [App\Http\Controllers\CompanyaccountController::class, 'destroy'])->middleware('permission:companyaccount-delete');
Route::get('/all_companyaccounts', [App\Http\Controllers\CompanyaccountController::class,'all_companyaccounts']);


Route::get('/warehouseaccount', [App\Http\Controllers\WarehouseaccountController::class, 'index'])->middleware('permission:warehouseaccount-list|warehouseaccount-create|warehouseaccount-edit|warehouseaccount-delete');
Route::get('/warehouseaccount/{id}', [App\Http\Controllers\WarehouseaccountController::class, 'show'])->middleware('permission:warehouseaccount-list|warehouseaccount-create|warehouseaccount-edit|warehouseaccount-delete');
Route::get('/search_warehouseaccount/{search_term}', [App\Http\Controllers\WarehouseaccountController::class, 'search'])->middleware('permission:warehouseaccount-list|warehouseaccount-create|warehouseaccount-edit|warehouseaccount-delete');
Route::post('/warehouseaccount', [App\Http\Controllers\WarehouseaccountController::class, 'store'])->middleware('permission:warehouseaccount-create');
Route::put('/warehouseaccount/{id}', [App\Http\Controllers\WarehouseaccountController::class, 'update'])->middleware('permission:warehouseaccount-edit');
Route::delete('/warehouseaccount/{id}', [App\Http\Controllers\WarehouseaccountController::class, 'destroy'])->middleware('permission:warehouseaccount-delete');
Route::get('/all_warehouseaccounts', [App\Http\Controllers\WarehouseaccountController::class,'all_warehouseaccounts']);


Route::get('/supplieraccount', [App\Http\Controllers\SupplieraccountController::class, 'index'])->middleware('permission:supplieraccount-list|supplieraccount-create|supplieraccount-edit|supplieraccount-delete');
Route::get('/supplieraccount/{id}', [App\Http\Controllers\SupplieraccountController::class, 'show'])->middleware('permission:supplieraccount-list|supplieraccount-create|supplieraccount-edit|supplieraccount-delete');
Route::get('/search_supplieraccount/{search_term}', [App\Http\Controllers\SupplieraccountController::class, 'search'])->middleware('permission:supplieraccount-list|supplieraccount-create|supplieraccount-edit|supplieraccount-delete');
Route::post('/supplieraccount', [App\Http\Controllers\SupplieraccountController::class, 'store'])->middleware('permission:supplieraccount-create');
Route::put('/supplieraccount/{id}', [App\Http\Controllers\SupplieraccountController::class, 'update'])->middleware('permission:supplieraccount-edit');
Route::delete('/supplieraccount/{id}', [App\Http\Controllers\SupplieraccountController::class, 'destroy'])->middleware('permission:supplieraccount-delete');
Route::get('/all_supplieraccounts', [App\Http\Controllers\SupplieraccountController::class,'all_supplieraccounts']);


Route::get('/producthistor', [App\Http\Controllers\ProducthistorController::class, 'index'])->middleware('permission:producthistor-list|producthistor-create|producthistor-edit|producthistor-delete');
Route::get('/producthistor/{id}', [App\Http\Controllers\ProducthistorController::class, 'show'])->middleware('permission:producthistor-list|producthistor-create|producthistor-edit|producthistor-delete');
Route::get('/search_producthistor/{search_term}', [App\Http\Controllers\ProducthistorController::class, 'search'])->middleware('permission:producthistor-list|producthistor-create|producthistor-edit|producthistor-delete');
Route::post('/producthistor', [App\Http\Controllers\ProducthistorController::class, 'store'])->middleware('permission:producthistor-create');
Route::put('/producthistor/{id}', [App\Http\Controllers\ProducthistorController::class, 'update'])->middleware('permission:producthistor-edit');
Route::delete('/producthistor/{id}', [App\Http\Controllers\ProducthistorController::class, 'destroy'])->middleware('permission:producthistor-delete');
Route::get('/all_producthistors', [App\Http\Controllers\ProducthistorController::class,'all_producthistors']);

// Catalog routes
Route::get('/catalog/products', [App\Http\Controllers\CatalogController::class, 'getCatalogProducts']);
Route::get('/catalog/export-pdf', [App\Http\Controllers\CatalogController::class, 'exportPdf']);
Route::get('/catalog/product/{id}', [App\Http\Controllers\CatalogController::class, 'getProduct']);

//add here

    Route::post('notifications/mark-as-read', [App\Http\Controllers\NotificationController::class, 'markAsRead']);
    
    // Image endpoints
    Route::get('/images/product-pictures', [App\Http\Controllers\ImageController::class, 'getProductPictures'])->middleware('permission:productinformation-list');
    Route::get('/images/technical-images', [App\Http\Controllers\ImageController::class, 'getTechnicalImages'])->middleware('permission:productinformation-list');
    Route::get('/images/box-images', [App\Http\Controllers\ImageController::class, 'getBoxImages'])->middleware('permission:boxe-list');
    Route::get('/images/label-images', [App\Http\Controllers\ImageController::class, 'getLabelImages'])->middleware('permission:label-list');
    Route::get('/images/other-images', [App\Http\Controllers\ImageController::class, 'getOtherImages'])->middleware('permission:view-hr-menu');
    
    // API END
});