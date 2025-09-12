<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
class OrderController extends BaseController
{
    protected $searchableColumns = ['customer_id', 'invoice_no', 'total_qty', 'total_weight', 'total_volume', 'subtotal', 'discount', 'extra_expenses', 'total_amount', 'deposit', 'customer_debt', 'balance', 'order_date', 'expected_date', 'shipping_date', 'status_id', 'invoice_language', 'company_id', 'internal_note', 'customer_note'];

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
        $query = Order::orderBy($sortBy, $sortDir);
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
        $order = $query->paginate($perPage); 
        $data = [
            "data" => $order->toArray(), 
            'current_page' => $order->currentPage(),
            'total_pages' => $order->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_orders(){
        $data = Order::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Order::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for order');
    }


    public function store(Request $request)
    {
        try {
            $validationRules = [
              "customer_id"=>"required|exists:customers,id",
              "invoice_no"=>"required|string|unique:orders,invoice_no|max:255",
              "total_qty"=>"nullable|integer",
              "total_weight"=>"nullable|numeric",
              "total_volume"=>"nullable|numeric",
              "subtotal"=>"nullable|numeric",
              "discount"=>"nullable|numeric",
              "extra_expenses"=>"nullable|numeric",
              "total_amount"=>"nullable|numeric",
              "deposit"=>"nullable|numeric",
              "customer_debt"=>"nullable|numeric",
              "balance"=>"nullable|numeric",
              "order_date"=>"required|date",
              "expected_date"=>"nullable|date",
              "shipping_date"=>"nullable|date",
              "status_id"=>"required|exists:productstatuses,id",
              "invoice_language"=>"nullable|string",
              "company_id"=>"required|exists:compans,id",
              "internal_note"=>"nullable|string",
              "customer_note"=>"nullable|string",
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated = $validation->validated();

            // Set default values
            $validated['discount'] = $validated['discount'] ?? 0;
            $validated['extra_expenses'] = $validated['extra_expenses'] ?? 0;
            $validated['deposit'] = $validated['deposit'] ?? 0;
            $validated['invoice_language'] = $validated['invoice_language'] ?? 'en';

            $order = Order::create($validated);
            return $this->sendResponse($order, "order created successfully");
        } catch (\Exception $e) {
            Log::error('Error creating order: ' . $e->getMessage());
            return $this->sendError("Error creating order", ['error' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $order = Order::findOrFail($id);
        return $this->sendResponse($order, "");
    }


    public function update(Request $request, $id)
    {
        try {
            $order = Order::findOrFail($id);
            $validationRules = [
              "customer_id"=>"required|exists:customers,id",
              "invoice_no"=>"required|string|unique:orders,invoice_no," . $id . "|max:255",
              "total_qty"=>"nullable|integer",
              "total_weight"=>"nullable|numeric",
              "total_volume"=>"nullable|numeric",
              "subtotal"=>"nullable|numeric",
              "discount"=>"nullable|numeric",
              "extra_expenses"=>"nullable|numeric",
              "total_amount"=>"nullable|numeric",
              "deposit"=>"nullable|numeric",
              "customer_debt"=>"nullable|numeric",
              "balance"=>"nullable|numeric",
              "order_date"=>"required|date",
              "expected_date"=>"nullable|date",
              "shipping_date"=>"nullable|date",
              "status_id"=>"required|exists:productstatuses,id",
              "invoice_language"=>"nullable|string",
              "company_id"=>"required|exists:compans,id",
              "internal_note"=>"nullable|string",
              "customer_note"=>"nullable|string",
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated = $validation->validated();

            $order->update($validated);
            return $this->sendResponse($order, "order updated successfully");
        } catch (\Exception $e) {
            Log::error('Error updating order: ' . $e->getMessage());
            return $this->sendError("Error updating order", ['error' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $order = Order::findOrFail($id);
            $order->delete();
            return $this->sendResponse(1, "order deleted successfully");
        } catch (\Exception $e) {
            Log::error('Error deleting order: ' . $e->getMessage());
            return $this->sendError("Error deleting order", ['error' => $e->getMessage()]);
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
