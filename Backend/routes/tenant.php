<?php

declare(strict_types=1);


use Illuminate\Foundation\Application;

use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;
use Stancl\Tenancy\Middleware\InitializeTenancyByRequestData;

Route::middleware([
    'api',
    InitializeTenancyByRequestData::class,
    // PreventAccessFromCentralDomains::class,
])->group(function () {

    // API END
    // require __DIR__.'/tenant_auth.php';
});
