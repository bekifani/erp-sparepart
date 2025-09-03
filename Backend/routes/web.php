<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TelegramWebhookController;
use Illuminate\Support\Facades\Log;

Route::get('/test-log', function () {
    Log::info('This is a test log entry');
    return 'Check your logs!';
});
Route::post('/telegram/webhook', [TelegramWebhookController::class, 'handle']);
Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

require __DIR__.'/auth.php';
