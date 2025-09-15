<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class CurrencyController extends BaseController
{
    protected $searchableColumns = ['code', 'name', 'symbol'];

    public function index(Request $request)
    {
        $sortBy = 'code';
        $sortDir = 'asc';
        if($request['sort']){
            $sortBy = $request['sort'][0]['field'];
            $sortDir = $request['sort'][0]['dir'];
        }
        $perPage = $request->query('size', 10); 
        $filters = $request['filter'];
        $query = Currency::orderBy($sortBy, $sortDir);
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
        $currencies = $query->paginate($perPage); 
        $data = [
            "data" => $currencies->toArray(), 
            'current_page' => $currencies->currentPage(),
            'total_pages' => $currencies->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_currencies(){
        $data = Currency::where('is_active', true)->orderBy('code')->get();
        return $this->sendResponse($data, 'Active currencies retrieved successfully');
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Currency::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'Search results for currencies');
    }

    public function store(Request $request)
    {
        try {
            $validationRules = [
                "code" => "required|string|size:3|unique:currencies,code",
                "name" => "required|string|max:255",
                "symbol" => "nullable|string|max:10",
                "is_active" => "boolean",
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if ($validation->fails()) {
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated = $validation->validated();

            // Convert code to uppercase
            $validated['code'] = strtoupper($validated['code']);
            
            // Set default active status
            if (!isset($validated['is_active'])) {
                $validated['is_active'] = true;
            }

            $currency = Currency::create($validated);
            return $this->sendResponse($currency, "Currency created successfully");
        } catch (\Exception $e) {
            Log::error('Currency creation failed: ' . $e->getMessage());
            return $this->sendError("Failed to create currency", ['error' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $currency = Currency::findOrFail($id);
        return $this->sendResponse($currency, "");
    }

    public function update(Request $request, $id)
    {
        try {
            $currency = Currency::findOrFail($id);
            $validationRules = [
                "code" => "required|string|size:3|unique:currencies,code," . $id,
                "name" => "required|string|max:255",
                "symbol" => "nullable|string|max:10",
                "is_active" => "boolean",
            ];

            $validation = Validator::make($request->all(), $validationRules);
            if ($validation->fails()) {
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated = $validation->validated();

            // Convert code to uppercase
            $validated['code'] = strtoupper($validated['code']);

            $currency->update($validated);
            return $this->sendResponse($currency, "Currency updated successfully");
        } catch (\Exception $e) {
            Log::error('Currency update failed: ' . $e->getMessage());
            return $this->sendError("Failed to update currency", ['error' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $currency = Currency::findOrFail($id);
            
            // Check if currency is used in exchange rates
            $exchangeRateCount = \App\Models\Exchangerate::where('currency', $currency->code)->count();
            if ($exchangeRateCount > 0) {
                return $this->sendError("Cannot delete currency that has exchange rates. Please delete exchange rates first or deactivate the currency.");
            }
            
            $currency->delete();
            return $this->sendResponse(1, "Currency deleted successfully");
        } catch (\Exception $e) {
            Log::error('Currency deletion failed: ' . $e->getMessage());
            return $this->sendError("Failed to delete currency", ['error' => $e->getMessage()]);
        }
    }

    public function toggle($id)
    {
        try {
            $currency = Currency::findOrFail($id);
            $currency->is_active = !$currency->is_active;
            $currency->save();
            
            $status = $currency->is_active ? 'activated' : 'deactivated';
            return $this->sendResponse($currency, "Currency {$status} successfully");
        } catch (\Exception $e) {
            Log::error('Currency toggle failed: ' . $e->getMessage());
            return $this->sendError("Failed to toggle currency status", ['error' => $e->getMessage()]);
        }
    }
}
