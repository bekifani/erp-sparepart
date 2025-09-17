<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Searchresult;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SearchLoggerMiddleware
{
    /**
     * Handle an incoming request and log search activities.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only log search-related endpoints
        if ($this->isSearchEndpoint($request)) {
            $this->logSearchActivity($request, $response);
        }

        return $response;
    }

    /**
     * Check if the current request is a search endpoint
     */
    private function isSearchEndpoint(Request $request): bool
    {
        $searchEndpoints = [
            '/api/search_product',
            '/api/search_brandname', 
            '/api/search_carmodel',
            '/api/search_category',
            '/api/search_productname',
            // Add more search endpoints as needed
        ];

        $path = $request->getPathInfo();
        
        foreach ($searchEndpoints as $endpoint) {
            if (strpos($path, $endpoint) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Log the search activity to searchresults table
     */
    private function logSearchActivity(Request $request, $response)
    {
        try {
            $searchQuery = $this->extractSearchQuery($request);
            $searchType = $this->determineSearchType($request);
            $resultFound = $this->checkIfResultsFound($response);
            
            // Determine user information
            $user = Auth::user();
            $userType = $this->determineUserType($user, $request);
            $userIdentifier = $this->getUserIdentifier($user, $request);

            // Create search log entry
            Searchresult::create([
                'user_id' => $user ? $user->id : null,
                'customer_id' => $this->getCustomerId($user),
                'query_text' => $searchQuery,
                'search_type' => $searchType,
                'result_found' => $resultFound,
                'search_timestamp' => Carbon::now(),
                'user_type' => $userType,
                'user_identifier' => $userIdentifier,
                'entity_type' => $this->getEntityType($request),
                'entity_id' => $this->getEntityId($request)
            ]);

        } catch (\Exception $e) {
            // Log error but don't break the application
            Log::error('SearchLoggerMiddleware error: ' . $e->getMessage(), [
                'request_path' => $request->getPathInfo(),
                'request_method' => $request->getMethod(),
                'user_id' => Auth::id()
            ]);
        }
    }

    /**
     * Extract search query from request
     */
    private function extractSearchQuery(Request $request): string
    {
        // Check various possible search parameter names
        $searchParams = ['search', 'query', 'q', 'term', 'keyword'];
        
        foreach ($searchParams as $param) {
            if ($request->has($param)) {
                return $request->get($param);
            }
        }

        // Check if it's a path parameter (e.g., /api/search_product/toyota)
        $pathSegments = explode('/', $request->getPathInfo());
        if (count($pathSegments) > 3) {
            return end($pathSegments);
        }

        return 'Unknown Query';
    }

    /**
     * Determine search type based on endpoint
     */
    private function determineSearchType(Request $request): string
    {
        $path = $request->getPathInfo();
        
        if (strpos($path, 'category') !== false) {
            return 'category';
        } elseif (strpos($path, 'carmodel') !== false || strpos($path, 'car_model') !== false) {
            return 'car_model';
        } elseif (strpos($path, 'productname') !== false || strpos($path, 'product_name') !== false) {
            return 'description';
        } elseif (strpos($path, 'brandname') !== false || strpos($path, 'brand') !== false) {
            return 'code';
        } else {
            return 'description'; // Default to description search
        }
    }

    /**
     * Check if the search returned results
     */
    private function checkIfResultsFound($response): bool
    {
        try {
            $content = $response->getContent();
            $data = json_decode($content, true);
            
            // Check various response structures
            if (isset($data['data'])) {
                if (is_array($data['data'])) {
                    return count($data['data']) > 0;
                } elseif (isset($data['data']['data'])) {
                    return count($data['data']['data']) > 0;
                }
            }
            
            // Check if response has results array
            if (isset($data['results']) && is_array($data['results'])) {
                return count($data['results']) > 0;
            }
            
            // Check if it's a paginated response
            if (isset($data['total']) && is_numeric($data['total'])) {
                return $data['total'] > 0;
            }
            
            return false;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Determine user type
     */
    private function determineUserType($user, Request $request): string
    {
        if (!$user) {
            return 'guest';
        }
        
        // Check if user has customer relationship
        if ($user->customer_id || method_exists($user, 'customer')) {
            return 'customer';
        }
        
        // Check if user is employee (has employee role or permissions)
        if ($user->hasRole('employee') || $user->permissions) {
            return 'employee';
        }
        
        return 'customer'; // Default for logged-in users
    }

    /**
     * Get user identifier for display
     */
    private function getUserIdentifier($user, Request $request): ?string
    {
        if ($user) {
            return $user->name ?? $user->email ?? null;
        }
        
        // For guests, try to get session ID or IP
        return $request->session()->getId() ?? $request->ip();
    }

    /**
     * Get customer ID if user is a customer
     */
    private function getCustomerId($user): ?int
    {
        if ($user && isset($user->customer_id)) {
            return $user->customer_id;
        }
        
        if ($user && method_exists($user, 'customer') && $user->customer) {
            return $user->customer->id;
        }
        
        return null;
    }

    /**
     * Get entity type from request
     */
    private function getEntityType(Request $request): ?string
    {
        $path = $request->getPathInfo();
        
        if (strpos($path, 'product') !== false) {
            return 'product';
        } elseif (strpos($path, 'brand') !== false) {
            return 'brand';
        } elseif (strpos($path, 'category') !== false) {
            return 'category';
        } elseif (strpos($path, 'carmodel') !== false) {
            return 'carmodel';
        }
        
        return null;
    }

    /**
     * Get entity ID from request if available
     */
    private function getEntityId(Request $request): ?int
    {
        // This would need to be implemented based on specific endpoint patterns
        // For now, return null as it's optional
        return null;
    }
}
