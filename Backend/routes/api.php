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
    Route::post('notifications/mark-as-read', [App\Http\Controllers\NotificationController::class, 'markAsRead']);
    // API END
});