<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Brandname;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log; 
use Illuminate\Support\Facades\DB;

class BrandnameController extends BaseController
{
    // Search only by brand name; number_of_products is computed aggregate
    protected $searchableColumns = ['brand_name'];

    public function index(Request $request)
    {
        Log::info('Incoming request to BrandnameController@index', [
            'method' => $request->method(),
            'params' => $request->all()
        ]);

        $sortBy = 'brandnames.id';
        $sortDir = 'desc';
        if ($request['sort']) {
            $sortBy = $request['sort'][0]['field'] === 'number_of_products'
                ? 'number_of_products' // will sort by alias via orderByRaw below
                : 'brandnames.' . $request['sort'][0]['field'];
            $sortDir = $request['sort'][0]['dir'];
        }
        $perPage = $request->query('size', 10); 
        $filters = $request['filter'];
        // Use inner join and ensure only brands with at least one product are returned
        $query = Brandname::query()
            ->join('products', 'products.brand_id', '=', 'brandnames.id')
            ->select([
                'brandnames.id',
                'brandnames.brand_name',
                DB::raw('COUNT(products.id) as number_of_products'),
            ])
            ->groupBy('brandnames.id', 'brandnames.brand_name')
            ->havingRaw('COUNT(products.id) > 0');
        // Apply sorting (handle aggregate alias separately)
        if (isset($request['sort'][0]['field']) && $request['sort'][0]['field'] === 'number_of_products') {
            $query->orderByRaw('number_of_products ' . $sortDir);
        } else {
            $query->orderBy($sortBy, $sortDir);
        }
        if ($filters) {
            foreach ($filters as $filter) {
                $field = $filter['field'];
                $operator = $filter['type'];
                $searchTerm = $filter['value'];
                if ($operator == 'like') {
                    $searchTerm = '%' . $searchTerm . '%';
                }
                if ($field === 'number_of_products') {
                    // aggregate; use HAVING
                    $query->having('number_of_products', $operator, $searchTerm);
                } else {
                    $query->where('brandnames.' . $field, $operator, $searchTerm);
                }
            }
        }
        $brandname = $query->paginate($perPage); 
        $data = [
            "data" => $brandname->toArray(), 
            'current_page' => $brandname->currentPage(),
            'total_pages' => $brandname->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_brandnames()
    {
        Log::info('Incoming request to BrandnameController@all_brandnames');
        $data = Brandname::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term)
    {
        Log::info('Incoming request to BrandnameController@search', [
            'method' => $request->method(),
            'params' => $request->all(),
            'search_term' => $search_term
        ]);

        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            Log::warning('Empty search term provided');
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        
        Log::info('Executing brand search query', [
            'search_term' => $searchTerm,
            'query' => "SELECT id, brand_name FROM brandnames WHERE LOWER(brand_name) LIKE LOWER('%{$searchTerm}%') LIMIT 20"
        ]);
        
        $results = Brandname::query()
            ->select(['id', 'brand_name'])
            ->whereRaw('LOWER(brand_name) LIKE LOWER(?)', ["%$searchTerm%"])
            ->limit(20)
            ->get();
            
        Log::info('Brand search query results', [
            'search_term' => $searchTerm,
            'results_count' => $results->count(),
            'results' => $results->toArray()
        ]);
        
        // If no results, let's check if there are any brands at all
        if ($results->isEmpty()) {
            $totalBrands = Brandname::count();
            Log::warning('No brands found for search term', [
                'search_term' => $searchTerm,
                'total_brands_in_db' => $totalBrands
            ]);
            
            // Return some sample brands for debugging
            $sampleBrands = Brandname::select(['id', 'brand_name'])->limit(5)->get();
            Log::info('Sample brands in database', [
                'sample_brands' => $sampleBrands->toArray()
            ]);
        }
            
        // Format for pagination response structure
        $paginatedResults = [
            'data' => $results,
            'current_page' => 1,
            'per_page' => 20,
            'total' => $results->count()
        ];
        
        Log::info('Brand search final response', [
            'paginated_results' => $paginatedResults
        ]);
        
        return $this->sendResponse($paginatedResults, 'search results for brandname');
    }

    public function store(Request $request)
    {
        Log::info('Blocked request to BrandnameController@store (read-only page)', [
            'method' => $request->method(),
            'params' => $request->all()
        ]);
        return response()->json([
            'message' => 'Brands are managed via the Products page. New brands are created when assigned to a product.'
        ], 405);
    }

    public function show($id)
    {
        Log::info('Incoming request to BrandnameController@show', [
            'id' => $id
        ]);

        $brandname = Brandname::findOrFail($id);
        return $this->sendResponse($brandname, "");
    }

    public function update(Request $request, $id)
    {
        Log::info('Blocked request to BrandnameController@update (read-only page)', [
            'method' => $request->method(),
            'id' => $id,
            'params' => $request->all()
        ]);
        return response()->json([
            'message' => 'Brand names cannot be edited here. Update brand assignments via the Products page.'
        ], 405);
    }

    public function destroy($id)
    {
        Log::info('Blocked request to BrandnameController@destroy (read-only page)', [
            'id' => $id
        ]);
        return response()->json([
            'message' => 'Brands cannot be deleted directly. They disappear when no products reference them.'
        ], 405);
    }

    public function deleteFile($filePath)
    {
        Log::info('Incoming request to BrandnameController@deleteFile', [
            'filePath' => $filePath
        ]);

        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
            return true;
        } else {
            return false;
        }
    }
}
