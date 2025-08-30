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
Route::get('/all_specificationheadnames', [App\Http\Controllers\SpecificationheadnameController::class,'all_specificationheadnames']);


Route::get('/boxe', [App\Http\Controllers\BoxeController::class, 'index'])->middleware('permission:boxe-list|boxe-create|boxe-edit|boxe-delete');
Route::get('/boxe/{id}', [App\Http\Controllers\BoxeController::class, 'show'])->middleware('permission:boxe-list|boxe-create|boxe-edit|boxe-delete');
Route::get('/search_boxe/{search_term}', [App\Http\Controllers\BoxeController::class, 'search'])->middleware('permission:boxe-list|boxe-create|boxe-edit|boxe-delete');
Route::post('/boxe', [App\Http\Controllers\BoxeController::class, 'store'])->middleware('permission:boxe-create');
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


Route::get('/productinformation', [App\Http\Controllers\ProductinformationController::class, 'index'])->middleware('permission:productInformation-list|productInformation-create|productInformation-edit|productInformation-delete');
Route::get('/productinformation/{id}', [App\Http\Controllers\ProductinformationController::class, 'show'])->middleware('permission:productInformation-list|productInformation-create|productInformation-edit|productInformation-delete');
Route::get('/search_productinformation/{search_term}', [App\Http\Controllers\ProductinformationController::class, 'search'])->middleware('permission:productInformation-list|productInformation-create|productInformation-edit|productInformation-delete');
Route::post('/productinformation', [App\Http\Controllers\ProductinformationController::class, 'store'])->middleware('permission:productInformation-create');
Route::put('/productinformation/{id}', [App\Http\Controllers\ProductinformationController::class, 'update'])->middleware('permission:productInformation-edit');
Route::delete('/productinformation/{id}', [App\Http\Controllers\ProductinformationController::class, 'destroy'])->middleware('permission:productInformation-delete');
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

    Route::post('notifications/mark-as-read', [App\Http\Controllers\NotificationController::class, 'markAsRead']);
    // API END
});