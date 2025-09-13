<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Productname;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProductnameController extends BaseController
{
    // Include both description_en and description (if the latter exists in some tenants)
    protected $searchableColumns = ['hs_code', 'name_az', 'description_en', 'description', 'name_ru', 'name_cn', 'category_id', 'product_name_code', 'additional_note', 'product_qty'];

    public function index(Request $request)
    {
        $sortBy = 'id';
        $sortDir = 'desc';
        if($request['sort']){
            $sortBy = $request['sort'][0]['field'];
            $sortDir = $request['sort'][0]['dir'];
        }
        $perPage = $request->query('size', 10); 
        $filters = $request['filter'];
        $query = Productname::with('category')->orderBy($sortBy, $sortDir);
        if($filters){
            foreach ($filters as $filter) {
                $field = $filter['field'];
                $operator = $filter['type'];
                $searchTerm = $filter['value'];
                if ($operator == 'like') {
                    $searchTerm = '%' . $searchTerm . '%';
                }
                $query->where($field, $operator, $searchTerm);
            }
        }
        $productname = $query->paginate($perPage); 
        $data = [
            "data" => $productname->toArray(), 
            'current_page' => $productname->currentPage(),
            'total_pages' => $productname->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_productnames(){
        $data = Productname::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }

        // Debug request context
        Log::info('ProductnameController@search called', [
            'search_term' => $searchTerm,
            'x_tenant' => $request->header('X-Tenant'),
        ]);

        // Filter columns against actual table schema to avoid querying non-existent columns (per-tenant safety)
        $table = (new \App\Models\Productname())->getTable();
        $existingColumns = Schema::hasTable($table) ? Schema::getColumnListing($table) : [];
        $allowedSearchColumns = array_values(array_intersect($this->searchableColumns, $existingColumns));
        $selectColumns = array_values(array_intersect([
            'id', 'hs_code', 'name_az', 'description_en', 'description', 'name_ru', 'name_cn', 'category_id', 'product_name_code', 'additional_note', 'product_qty'
        ], $existingColumns));

        Log::info('ProductnameController@search columns', [
            'table' => $table,
            'existingColumns' => $existingColumns,
            'allowedSearchColumns' => $allowedSearchColumns,
            'selectColumns' => $selectColumns,
        ]);

        if (empty($allowedSearchColumns)) {
            return $this->sendResponse(["data" => [], "message" => "No searchable columns available"], 'search results for productname');
        }

        $results = Productname::where(function ($query) use ($searchTerm, $allowedSearchColumns) {
            foreach ($allowedSearchColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })
        ->select(!empty($selectColumns) ? $selectColumns : ['id'])
        ->paginate(20);

        return $this->sendResponse($results , 'search results for productname');
    }

    public function store(Request $request)
    {
        \Log::info('ProductnameController@store called', [
            'method' => $request->method(),
            'data' => $request->all()
        ]);

        $validationRules = [
          "hs_code"=>"nullable|string|max:255",
          "name_az"=>"required|string|max:255",
          "description_en"=>"required|string|max:255",
          "name_ru"=>"required|string|max:255",
          "name_cn"=>"required|string|max:255",
          "category_id"=>"required|integer|exists:categors,id",
          "product_name_code"=>"prohibited",
          "additional_note"=>"nullable|string",
          "product_qty"=>"nullable|numeric",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            \Log::error('Validation failed in ProductnameController@store', [
                'errors' => $validation->errors()->toArray()
            ]);
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        \Log::info('Validation passed, creating productname', [
            'validated_data' => $validated
        ]);

        // Generate 2-character code per category (33x33 = 1089 combinations)
        $alphabet = '0123456789SPEBNMCFGHRTZXDYKLVJUAW'; // length = 33
        $len = strlen($alphabet);
        $existingCount = Productname::where('category_id', $validated['category_id'])->count();
        $n = $existingCount + 1; // 1-based position within category
        if ($n > ($len * $len)) {
            return $this->sendError("Category capacity reached for product name codes (max 1089).", ['errors' => ['product_name_code' => ['Capacity exceeded']]]);
        }
        $firstIndex = intdiv($n - 1, $len); // 0..32
        $secondIndex = ($n - 1) % $len;     // 0..32
        $validated['product_name_code'] = $alphabet[$firstIndex] . $alphabet[$secondIndex];

        try {
            $productname = Productname::create($validated);
            \Log::info('Productname created successfully', [
                'productname_id' => $productname->id
            ]);
            return $this->sendResponse($productname, "productname created succesfully");
        } catch (\Exception $e) {
            \Log::error('Error creating productname', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->sendError("Error creating productname", ['error' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $productname = Productname::findOrFail($id);
        return $this->sendResponse($productname, "");
    }

    public function update(Request $request, $id)
    {
        $productname = Productname::findOrFail($id);
         $validationRules = [
          "hs_code"=>"nullable|string|max:255",
          "name_az"=>"required|string|max:255",
          "description_en"=>"required|string|max:255",
          "name_ru"=>"required|string|max:255",
          "name_cn"=>"required|string|max:255",
          "category_id"=>"required|integer|exists:categors,id",
          "product_name_code"=>"prohibited",
          "additional_note"=>"nullable|string",
          "product_qty"=>"nullable|numeric",
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        $productname->update($validated);
        return $this->sendResponse($productname, "productname updated successfully");
    }

    public function destroy($id)
    {
        $productname = Productname::findOrFail($id);
        $productname->delete();

        return $this->sendResponse(1, "productname deleted succesfully");
    }

    public function deleteFile($filePath) {
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
            return true;
        } else {
            return false;
        }
    }
}
