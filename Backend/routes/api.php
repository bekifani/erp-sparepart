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

    // Public read-only customer endpoints (no auth required for lookups)
    Route::get('/customer', [App\Http\Controllers\CustomerController::class, 'index'])->withoutMiddleware('auth.api');
    Route::get('/customer/{id}', [App\Http\Controllers\CustomerController::class, 'show'])->withoutMiddleware('auth.api');
    Route::get('/search_customer/{search_term}', [App\Http\Controllers\CustomerController::class, 'search'])->withoutMiddleware('auth.api');
    Route::post('/customer', [App\Http\Controllers\CustomerController::class, 'store']);
    Route::put('/customer/{id}', [App\Http\Controllers\CustomerController::class, 'update']);
    Route::delete('/customer/{id}', [App\Http\Controllers\CustomerController::class, 'destroy']);
    Route::get('/all_customers', [App\Http\Controllers\CustomerController::class,'all_customers']);


    Route::get('/supplier', [App\Http\Controllers\SupplierController::class, 'index'])->middleware('permission:supplier-list|supplier-create|supplier-edit|supplier-delete');
    Route::get('/supplier/{id}', [App\Http\Controllers\SupplierController::class, 'show'])->middleware('permission:supplier-list|supplier-create|supplier-edit|supplier-delete');
    Route::get('/search_supplier/{search_term}', [App\Http\Controllers\SupplierController::class, 'search'])->middleware('permission:supplier-list|supplier-create|supplier-edit|supplier-delete');
    Route::post('/supplier', [App\Http\Controllers\SupplierController::class, 'store'])->middleware('permission:supplier-create');
    Route::put('/supplier/{id}', [App\Http\Controllers\SupplierController::class, 'update'])->middleware('permission:supplier-edit');
    Route::delete('/supplier/{id}', [App\Http\Controllers\SupplierController::class, 'destroy'])->middleware('permission:supplier-delete');
    Route::get('/all_suppliers', [App\Http\Controllers\SupplierController::class,'all_suppliers']);


    Route::get('/brandname', [App\Http\Controllers\BrandnameController::class, 'index']);
    Route::get('/brandname/{id}', [App\Http\Controllers\BrandnameController::class, 'show']);
    Route::get('/search_brandname/{search_term}', [App\Http\Controllers\BrandnameController::class, 'search'])->withoutMiddleware('auth.api');
    Route::post('/brandname', [App\Http\Controllers\BrandnameController::class, 'store'])->middleware('permission:brandname-create');
    Route::put('/brandname/{id}', [App\Http\Controllers\BrandnameController::class, 'update'])->middleware('permission:brandname-edit');
    Route::delete('/brandname/{id}', [App\Http\Controllers\BrandnameController::class, 'destroy'])->middleware('permission:brandname-delete');
    Route::get('/all_brandnames', [App\Http\Controllers\BrandnameController::class,'all_brandnames']);


    Route::get('/product', [App\Http\Controllers\ProductController::class, 'index']);
    Route::get('/product/{id}', [App\Http\Controllers\ProductController::class, 'show']);
    Route::get('/search_product/{search_term}', [App\Http\Controllers\ProductController::class, 'search'])->withoutMiddleware('auth.api');
    Route::post('/product', [App\Http\Controllers\ProductController::class, 'store'])->middleware('permission:product-create');
    Route::put('/product/{id}', [App\Http\Controllers\ProductController::class, 'update'])->middleware('permission:product-edit');
    Route::delete('/product/{id}', [App\Http\Controllers\ProductController::class, 'destroy'])->middleware('permission:product-delete');
    Route::get('/all_products', [App\Http\Controllers\ProductController::class,'all_products']);


    Route::get('/customerbrandvisibilit', [App\Http\Controllers\CustomerbrandvisibilitController::class, 'index'])->withoutMiddleware('auth.api');
    Route::get('/customerbrandvisibilit/{id}', [App\Http\Controllers\CustomerbrandvisibilitController::class, 'show'])->withoutMiddleware('auth.api');
    Route::get('/search_customerbrandvisibilit/{search_term}', [App\Http\Controllers\CustomerbrandvisibilitController::class, 'search'])->withoutMiddleware('auth.api');
    Route::post('/customerbrandvisibilit', [App\Http\Controllers\CustomerbrandvisibilitController::class, 'store']);
    Route::put('/customerbrandvisibilit/{id}', [App\Http\Controllers\CustomerbrandvisibilitController::class, 'update']);
    Route::delete('/customerbrandvisibilit/{id}', [App\Http\Controllers\CustomerbrandvisibilitController::class, 'destroy']);
    Route::get('/all_customerbrandvisibilits', [App\Http\Controllers\CustomerbrandvisibilitController::class,'all_customerbrandvisibilits']);


    Route::get('/customerproductvisibilit', [App\Http\Controllers\CustomerproductvisibilitController::class, 'index'])->withoutMiddleware('auth.api');
    Route::get('/customerproductvisibilit/{id}', [App\Http\Controllers\CustomerproductvisibilitController::class, 'show'])->withoutMiddleware('auth.api');
    Route::get('/search_customerproductvisibilit/{search_term}', [App\Http\Controllers\CustomerproductvisibilitController::class, 'search'])->withoutMiddleware('auth.api');
    Route::post('/customerproductvisibilit', [App\Http\Controllers\CustomerproductvisibilitController::class, 'store']);
    Route::put('/customerproductvisibilit/{id}', [App\Http\Controllers\CustomerproductvisibilitController::class, 'update']);
    Route::delete('/customerproductvisibilit/{id}', [App\Http\Controllers\CustomerproductvisibilitController::class, 'destroy']);
    Route::get('/all_customerproductvisibilits', [App\Http\Controllers\CustomerproductvisibilitController::class,'all_customerproductvisibilits']);


    // ... rest of the routes ...

    Route::post('notifications/mark-as-read', [App\Http\Controllers\NotificationController::class, 'markAsRead']);
    // API END
});