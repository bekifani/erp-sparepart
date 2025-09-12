<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Basket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
class BasketController extends BaseController
{
    protected $searchableColumns = ['basket_number', 'customer_id', 'total_qty', 'total_weight', 'total_volume', 'total_amount', 'invoice_language', 'status', 'first_edit_date', 'last_edit_date', 'additional_note'];

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
        $query = Basket::orderBy($sortBy, $sortDir);
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
        $basket = $query->paginate($perPage); 
        $data = [
            "data" => $basket->toArray(), 
            'current_page' => $basket->currentPage(),
            'total_pages' => $basket->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_baskets(){
        $data = Basket::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Basket::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for basket');
    }


    public function store(Request $request)
    {
        try {
            $validationRules = [
              
              "basket_number"=>"required|string|unique:baskets,basket_number|max:255",
              "customer_id"=>"nullable|exists:customers,id",
              "total_qty"=>"nullable|integer",
              "total_weight"=>"nullable|numeric",
              "total_volume"=>"nullable|numeric",
              "total_amount"=>"nullable|numeric",
              "invoice_language"=>"nullable|string",
              "status"=>"nullable|string",
              "first_edit_date"=>"nullable|date",
              "last_edit_date"=>"nullable|date",
              "additional_note"=>"nullable|string",
              

            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();

            // Set default values if not provided
            $validated['invoice_language'] = $validated['invoice_language'] ?? 'en';
            $validated['status'] = $validated['status'] ?? 'draft';
            $validated['first_edit_date'] = $validated['first_edit_date'] ?? now();
            $validated['last_edit_date'] = $validated['last_edit_date'] ?? now();

            $basket = Basket::create($validated);
            return $this->sendResponse($basket, "basket created succesfully");
        } catch (\Throwable $e) {
            Log::error('Basket@store failed: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return $this->sendError('Failed to create basket', ['message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $basket = Basket::findOrFail($id);
        return $this->sendResponse($basket, "");
    }


    public function update(Request $request, $id)
    {
        try {
            $basket = Basket::findOrFail($id);
             $validationRules = [
                //for update

              
              "basket_number"=>"required|string|unique:baskets,basket_number," . $id . "|max:255",
              "customer_id"=>"required|exists:customers,id",
              "total_qty"=>"nullable|integer",
              "total_weight"=>"nullable|numeric",
              "total_volume"=>"nullable|numeric",
              "total_amount"=>"nullable|numeric",
              "invoice_language"=>"nullable|string",
              "status"=>"nullable|string",
              "first_edit_date"=>"nullable|date",
              "last_edit_date"=>"nullable|date",
              "additional_note"=>"nullable|string",
              
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();

            // Update last_edit_date
            $validated['last_edit_date'] = now();

            $basket->update($validated);
            return $this->sendResponse($basket, "basket updated successfully");
        } catch (\Throwable $e) {
            Log::error('Basket@update failed: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return $this->sendError('Failed to update basket', ['message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $basket = Basket::findOrFail($id);
            $basket->delete();

            //delete files uploaded
            return $this->sendResponse(1, "basket deleted succesfully");
        } catch (\Throwable $e) {
            Log::error('Basket@destroy failed: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return $this->sendError('Failed to delete basket', ['message' => $e->getMessage()], 500);
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
}
