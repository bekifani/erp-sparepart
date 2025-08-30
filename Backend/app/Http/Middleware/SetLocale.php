<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->header('Accept-Language');
        if ($locale && in_array($locale, ['am', 'en',])) { 
            App::setLocale($locale);
        } else {
            App::setLocale(config('app.locale')); 
        }
        return $next($request);
    }
}
