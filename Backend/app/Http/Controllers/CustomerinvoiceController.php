<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Customerinvoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
class CustomerinvoiceController extends BaseController
{
    protected $searchableColumns = ['invoice_no', 'customer_id', 'company_name', 'customer_name', 'country', 'address', 'tax_id', 'phone_number', 'email', 'shipping_mark', 'shipped_date', 'language', 'total_qty', 'total_net_weight', 'total_gross_weight', 'total_volume', 'total_amount', 'discount', 'deposit', 'extra_expenses', 'customer_debt', 'balance', 'status', 'attached_file', 'created_by'];

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
        $query = Customerinvoice::orderBy($sortBy, $sortDir);
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
        $customerinvoice = $query->paginate($perPage); 
        $data = [
            "data" => $customerinvoice->toArray(), 
            'current_page' => $customerinvoice->currentPage(),
            'total_pages' => $customerinvoice->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_customerinvoices(){
        $data = Customerinvoice::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Customerinvoice::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for customerinvoice');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "invoice_no"=>"required|string|unique:customerinvoices,invoice_no|max:255",
          "customer_id"=>"nullable|exists:customers,id",
          "company_name"=>"required|string|max:255",
          "customer_name"=>"required|string|max:255",
          "country"=>"nullable|string|max:255",
          "address"=>"nullable|string",
          "tax_id"=>"nullable|string|max:255",
          "phone_number"=>"nullable|string|max:255",
          "email"=>"nullable|email|max:255",
          "shipping_mark"=>"nullable|string|max:255",
          "shipped_date"=>"nullable|date",
          "language"=>"nullable|string|max:255",
          "total_qty"=>"nullable|integer",
          "total_net_weight"=>"nullable|numeric",
          "total_gross_weight"=>"nullable|numeric",
          "total_volume"=>"nullable|numeric",
          "total_amount"=>"nullable|numeric",
          "discount"=>"nullable|numeric",
          "deposit"=>"nullable|numeric",
          "extra_expenses"=>"nullable|numeric",
          "customer_debt"=>"nullable|numeric",
          "balance"=>"nullable|numeric",
          "status"=>"nullable|string|max:255",
          "attached_file"=>"nullable|string|max:255",
          "created_by"=>"nullable|exists:users,id",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        try {
            // Set default values programmatically
            $validated['language'] = $validated['language'] ?? 'en';
            $validated['discount'] = $validated['discount'] ?? 0;
            $validated['deposit'] = $validated['deposit'] ?? 0;
            $validated['extra_expenses'] = $validated['extra_expenses'] ?? 0;
            $validated['customer_debt'] = $validated['customer_debt'] ?? 0;
            $validated['status'] = $validated['status'] ?? 'draft';
            
            $customerinvoice = Customerinvoice::create($validated);
            return $this->sendResponse($customerinvoice, "customerinvoice created succesfully");
        } catch (\Exception $e) {
            Log::error('CustomerinvoiceController store error: ' . $e->getMessage());
            return $this->sendError("Error creating customerinvoice", ['error' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $customerinvoice = Customerinvoice::findOrFail($id);
        return $this->sendResponse($customerinvoice, "");
    }


    public function update(Request $request, $id)
    {
        $customerinvoice = Customerinvoice::findOrFail($id);
         $validationRules = [
            //for update

          
          "invoice_no"=>"required|string|unique:customerinvoices,invoice_no,$id|max:255",
          "customer_id"=>"nullable|exists:customers,id",
          "company_name"=>"required|string|max:255",
          "customer_name"=>"required|string|max:255",
          "country"=>"nullable|string|max:255",
          "address"=>"nullable|string",
          "tax_id"=>"nullable|string|max:255",
          "phone_number"=>"nullable|string|max:255",
          "email"=>"nullable|email|max:255",
          "shipping_mark"=>"nullable|string|max:255",
          "shipped_date"=>"nullable|date",
          "language"=>"nullable|string|max:255",
          "total_qty"=>"nullable|integer",
          "total_net_weight"=>"nullable|numeric",
          "total_gross_weight"=>"nullable|numeric",
          "total_volume"=>"nullable|numeric",
          "total_amount"=>"nullable|numeric",
          "discount"=>"nullable|numeric",
          "deposit"=>"nullable|numeric",
          "extra_expenses"=>"nullable|numeric",
          "customer_debt"=>"nullable|numeric",
          "balance"=>"nullable|numeric",
          "status"=>"nullable|string|max:255",
          "attached_file"=>"nullable|string|max:255",
          "created_by"=>"nullable|exists:users,id",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();

        try {
            // Set default values programmatically
            $validated['language'] = $validated['language'] ?? 'en';
            $validated['discount'] = $validated['discount'] ?? 0;
            $validated['deposit'] = $validated['deposit'] ?? 0;
            $validated['extra_expenses'] = $validated['extra_expenses'] ?? 0;
            $validated['customer_debt'] = $validated['customer_debt'] ?? 0;
            $validated['status'] = $validated['status'] ?? 'draft';
            
            $customerinvoice->update($validated);
            return $this->sendResponse($customerinvoice, "customerinvoice updated successfully");
        } catch (\Exception $e) {
            Log::error('CustomerinvoiceController update error: ' . $e->getMessage());
            return $this->sendError("Error updating customerinvoice", ['error' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $customerinvoice = Customerinvoice::findOrFail($id);
        $customerinvoice->delete();





        //delete files uploaded
        return $this->sendResponse(1, "customerinvoice deleted succesfully");
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
