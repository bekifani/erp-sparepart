<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;
use App\Models\Tenant;
use App\Observers\TenantObserver;

use Illuminate\Notifications\ChannelManager;
use App\Broadcasting\SmsChannel;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(ChannelManager $channelManager): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });
        Tenant::observe(TenantObserver::class);
        $channelManager->extend('sms', function ($app) {
            return new SmsChannel();
        });
    }
}
