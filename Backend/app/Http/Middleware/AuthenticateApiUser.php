<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Auth;
use Symfony\Component\HttpFoundation\Response;
class AuthenticateApiUser
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::guard('sanctum')->check()) {
            return response()->json(['message' => 'Unauthorized Access'], Response::HTTP_UNAUTHORIZED);
        }
        return $next($request);
    }
}
