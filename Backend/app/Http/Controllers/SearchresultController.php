<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Searchresult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
class SearchresultController extends BaseController
{
    protected $searchableColumns = [
        'searchresults.query_text', 
        'searchresults.search_type', 
        'searchresults.user_type',
        'users.name as user_name',
        'customers.name_surname as customer_name'
    ];

    public function index(Request $request)
    {
        try {
            $sortBy = 'searchresults.search_timestamp';
            $sortDir = 'desc';
            if($request['sort']){
                $sortBy = $request['sort'][0]['field'];
                $sortDir = $request['sort'][0]['dir'];
            }
            $perPage = $request->query('size', 10); 
            $filters = $request['filter'];
            
            $query = Searchresult::select([
                'searchresults.*',
                'users.name as user_name',
                'customers.name_surname as customer_name'
            ])
            ->leftJoin('users', 'searchresults.user_id', '=', 'users.id')
            ->leftJoin('customers', 'searchresults.customer_id', '=', 'customers.id')
            ->orderBy($sortBy, $sortDir);
            
            if($filters){
                foreach ($filters as $filter) {
                    $field = $filter['field'];
                    $operator = $filter['type'];
                    $searchTerm = $filter['value'];
                    
                    // Map frontend field names to database field names
                    $fieldMapping = [
                        'date_time' => 'searchresults.search_timestamp',
                        'user_display' => 'users.name',
                        'search_type_display' => 'searchresults.search_type',
                        'search_query' => 'searchresults.query_text',
                        'result_display' => 'searchresults.result_found',
                        'user_type' => 'searchresults.user_type',
                        'search_type' => 'searchresults.search_type',
                        'result_found' => 'searchresults.result_found'
                    ];
                    
                    // Use mapped field name if exists, otherwise use original
                    $dbField = $fieldMapping[$field] ?? $field;
                    
                    if ($operator == 'like') {
                        $searchTerm = '%' . $searchTerm . '%';
                    }
                    
                    // Handle boolean conversion for result_found
                    if ($field === 'result_found' || $field === 'result_display') {
                        $searchTerm = (bool) $searchTerm;
                        $dbField = 'searchresults.result_found';
                    }
                    
                    $query->where($dbField, $operator, $searchTerm);
                }
            }
            
            $searchresult = $query->paginate($perPage);
            
            // Transform data to include computed fields
            $transformedData = $searchresult->getCollection()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'date_time' => $item->search_timestamp ? $item->search_timestamp->format('Y-m-d H:i:s') : $item->created_at->format('Y-m-d H:i:s'),
                    'user_display' => $this->getUserDisplay($item),
                    'search_type_display' => $this->getSearchTypeDisplay($item->search_type),
                    'search_query' => $item->query_text,
                    'result_display' => $item->result_found ? 'Yes' : 'No',
                    'result_found' => $item->result_found,
                    'search_type' => $item->search_type,
                    'user_type' => $item->user_type,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at
                ];
            });
            
            $data = [
                "data" => [
                    "data" => $transformedData,
                    "current_page" => $searchresult->currentPage(),
                    "last_page" => $searchresult->lastPage(),
                    "per_page" => $searchresult->perPage(),
                    "total" => $searchresult->total()
                ],
                'current_page' => $searchresult->currentPage(),
                'total_pages' => $searchresult->lastPage(),
                'per_page' => $perPage
            ];
            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('SearchresultController index error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch search results'], 500);
        }
    }

    public function all_searchresults(){
        $data = Searchresult::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        try {
            $searchTerm = $search_term;
            if (empty($searchTerm)) {
                return response()->json([
                    'message' => 'Please enter a search term.'
                ], 400);
            }
            
            $results = Searchresult::select([
                'searchresults.*',
                'users.name as user_name',
                'customers.name_surname as customer_name'
            ])
            ->leftJoin('users', 'searchresults.user_id', '=', 'users.id')
            ->leftJoin('customers', 'searchresults.customer_id', '=', 'customers.id')
            ->where(function ($query) use ($searchTerm) {
                $query->where('searchresults.query_text', 'like', "%$searchTerm%")
                      ->orWhere('searchresults.search_type', 'like', "%$searchTerm%")
                      ->orWhere('searchresults.user_type', 'like', "%$searchTerm%")
                      ->orWhere('users.name', 'like', "%$searchTerm%")
                      ->orWhere('customers.name_surname', 'like', "%$searchTerm%");
            })
            ->paginate(20);
            
            return $this->sendResponse($results, 'search results for searchresult');
        } catch (\Exception $e) {
            Log::error('SearchresultController search error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to search results'], 500);
        }
    }


    public function store(Request $request)
    {
        try {
            $validationRules = [
                "user_id" => "nullable|exists:users,id",
                "customer_id" => "nullable|exists:customers,id",
                "query_text" => "required|string|max:255",
                "search_type" => "required|in:category,car_model,description,code",
                "result_found" => "required|boolean",
                "search_timestamp" => "nullable|date",
                "user_type" => "required|in:guest,customer,employee",
                "user_identifier" => "nullable|string|max:255",
                "entity_type" => "nullable|string|max:255",
                "entity_id" => "nullable|integer",
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated = $validation->validated();
            
            // Set search_timestamp to now if not provided
            if (!isset($validated['search_timestamp'])) {
                $validated['search_timestamp'] = Carbon::now();
            }

            $searchresult = Searchresult::create($validated);
            return $this->sendResponse($searchresult, "Search result logged successfully");
        } catch (\Exception $e) {
            Log::error('SearchresultController store error: ' . $e->getMessage());
            return $this->sendError("Server error", ['error' => 'Failed to create search result']);
        }
    }

    public function show($id)
    {
        $searchresult = Searchresult::findOrFail($id);
        return $this->sendResponse($searchresult, "");
    }


    public function update(Request $request, $id)
    {
        try {
            $searchresult = Searchresult::findOrFail($id);
            $validationRules = [
                "user_id" => "nullable|exists:users,id",
                "customer_id" => "nullable|exists:customers,id", 
                "query_text" => "required|string|max:255",
                "search_type" => "required|in:category,car_model,description,code",
                "result_found" => "required|boolean",
                "search_timestamp" => "nullable|date",
                "user_type" => "required|in:guest,customer,employee",
                "user_identifier" => "nullable|string|max:255",
                "entity_type" => "nullable|string|max:255",
                "entity_id" => "nullable|integer",
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated = $validation->validated();

            $searchresult->update($validated);
            return $this->sendResponse($searchresult, "Search result updated successfully");
        } catch (\Exception $e) {
            Log::error('SearchresultController update error: ' . $e->getMessage());
            return $this->sendError("Server error", ['error' => 'Failed to update search result']);
        }
    }

    public function destroy($id)
    {
        try {
            $searchresult = Searchresult::findOrFail($id);
            $searchresult->delete();
            return $this->sendResponse(1, "Search result deleted successfully");
        } catch (\Exception $e) {
            Log::error('SearchresultController destroy error: ' . $e->getMessage());
            return $this->sendError("Server error", ['error' => 'Failed to delete search result']);
        }
    }

    public function deleteFile($filePath) {
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
            return true;
        } else {
            return false;
        }
    }

    // Helper method to get user display name
    private function getUserDisplay($item)
    {
        switch ($item->user_type) {
            case 'guest':
                return 'Guest';
            case 'customer':
                return $item->customer_name ?: ($item->user_identifier ?: 'Unknown Customer');
            case 'employee':
                return $item->user_name ?: ($item->user_identifier ?: 'Unknown Employee');
            default:
                return 'Unknown';
        }
    }

    // Helper method to get search type display name
    private function getSearchTypeDisplay($searchType)
    {
        $types = [
            'category' => 'By Category',
            'car_model' => 'By Car Model', 
            'description' => 'By Description (Product Name)',
            'code' => 'By Code (Brand Code, OE Code, or Cross Code)'
        ];
        
        return $types[$searchType] ?? $searchType;
    }
}
