<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;

Route::get('/test-log', function () {
    Log::info('This is a test log entry');
    return 'Check your logs!';
});

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// Public catalog route - no authentication required
Route::get('/public/catalog', function () {
    return view('catalog.public');
})->name('public.catalog');

require __DIR__.'/auth.php';
