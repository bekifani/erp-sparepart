<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Supplierinvoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Exception;
class SupplierinvoiceController extends BaseController
{
    protected $searchableColumns = ['invoice_no', 'supplier_id', 'customer_id', 'user_id', 'arrival_time', 'shipping_date', 'shipped_date', 'shipping_mark', 'supplier_code', 'total_products_qty', 'total_qty', 'total_amount', 'total_weight', 'total_volume', 'total_ctn', 'discount', 'deposit', 'extra_expenses', 'supplier_debt', 'balance', 'additional_note', 'status'];

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
        $query = Supplierinvoice::orderBy($sortBy, $sortDir);
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
        $supplierinvoice = $query->paginate($perPage); 
        $data = [
            "data" => $supplierinvoice->toArray(), 
            'current_page' => $supplierinvoice->currentPage(),
            'total_pages' => $supplierinvoice->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_supplierinvoices(){
        $data = Supplierinvoice::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Supplierinvoice::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for supplierinvoice');
    }


    public function store(Request $request)
    {
        try {
            $validationRules = [
              
              "invoice_no"=>"required|string|max:255",
              "supplier_id"=>"nullable|exists:suppliers,id",
              "customer_id"=>"nullable|exists:customers,id",
              "user_id"=>"nullable|exists:users,id",
              "arrival_time"=>"nullable|date",
              "shipping_date"=>"nullable|date",
              "shipped_date"=>"nullable|date",
              "shipping_mark"=>"nullable|string|max:255",
              "supplier_code"=>"nullable|string|max:255",
              "total_products_qty"=>"nullable|integer",
              "total_qty"=>"nullable|integer",
              "total_amount"=>"nullable|numeric",
              "total_weight"=>"nullable|numeric",
              "total_volume"=>"nullable|numeric",
              "total_ctn"=>"nullable|integer",
              "discount"=>"nullable|numeric",
              "deposit"=>"nullable|numeric",
              "extra_expenses"=>"nullable|numeric",
              "supplier_debt"=>"nullable|numeric",
              "balance"=>"nullable|numeric",
              "additional_note"=>"nullable|string",
              "status"=>"nullable|string",
              

            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();



            
            //file uploads

            $supplierinvoice = Supplierinvoice::create($validated);
            return $this->sendResponse($supplierinvoice, "supplierinvoice created succesfully");
        } catch (Exception $e) {
            Log::error('Error creating supplier invoice: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'exception' => $e
            ]);
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the supplier invoice.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $supplierinvoice = Supplierinvoice::findOrFail($id);
        return $this->sendResponse($supplierinvoice, "");
    }


    public function update(Request $request, $id)
    {
        try {
            $supplierinvoice = Supplierinvoice::findOrFail($id);
             $validationRules = [
                //for update

              
              "invoice_no"=>"required|string|max:255",
              "supplier_id"=>"nullable|exists:suppliers,id",
              "customer_id"=>"nullable|exists:customers,id",
              "user_id"=>"nullable|exists:users,id",
              "arrival_time"=>"nullable|date",
              "shipping_date"=>"nullable|date",
              "shipped_date"=>"nullable|date",
              "shipping_mark"=>"nullable|string|max:255",
              "supplier_code"=>"nullable|string|max:255",
              "total_products_qty"=>"nullable|integer",
              "total_qty"=>"nullable|integer",
              "total_amount"=>"nullable|numeric",
              "total_weight"=>"nullable|numeric",
              "total_volume"=>"nullable|numeric",
              "total_ctn"=>"nullable|integer",
              "discount"=>"nullable|numeric",
              "deposit"=>"nullable|numeric",
              "extra_expenses"=>"nullable|numeric",
              "supplier_debt"=>"nullable|numeric",
              "balance"=>"nullable|numeric",
              "additional_note"=>"nullable|string",
              "status"=>"nullable|string",
              
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();




            //file uploads update

            $supplierinvoice->update($validated);
            return $this->sendResponse($supplierinvoice, "supplierinvoice updated successfully");
        } catch (Exception $e) {
            Log::error('Error updating supplier invoice: ' . $e->getMessage(), [
                'id' => $id,
                'request_data' => $request->all(),
                'exception' => $e
            ]);
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the supplier invoice.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $supplierinvoice = Supplierinvoice::findOrFail($id);
            $supplierinvoice->delete();





            //delete files uploaded
            return $this->sendResponse(1, "supplierinvoice deleted succesfully");
        } catch (Exception $e) {
            Log::error('Error deleting supplier invoice: ' . $e->getMessage(), [
                'id' => $id,
                'exception' => $e
            ]);
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the supplier invoice.',
                'error' => $e->getMessage()
            ], 500);
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
