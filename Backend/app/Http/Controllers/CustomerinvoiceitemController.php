<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Customerinvoiceitem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
class CustomerinvoiceitemController extends BaseController
{
    protected $searchableColumns = ['customer_invoice_id', 'product_id', 'hs_code', 'brand', 'brand_code', 'oe_code', 'description', 'qty', 'price', 'amount', 'additional_note'];

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
        $query = Customerinvoiceitem::orderBy($sortBy, $sortDir);
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
        $customerinvoiceitem = $query->paginate($perPage); 
        $data = [
            "data" => $customerinvoiceitem->toArray(), 
            'current_page' => $customerinvoiceitem->currentPage(),
            'total_pages' => $customerinvoiceitem->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_customerinvoiceitems(){
        $data = Customerinvoiceitem::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Customerinvoiceitem::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for customerinvoiceitem');
    }


    public function store(Request $request)
    {
        try {
            $validationRules = [
              
              "customer_invoice_id"=>"required|exists:customerinvoices,id",
              "product_id"=>"required|exists:products,id",
              "hs_code"=>"nullable|string|max:255",
              "brand"=>"nullable|string|max:255",
              "brand_code"=>"nullable|string|max:255",
              "oe_code"=>"nullable|string|max:255",
              "description"=>"nullable|string",
              "qty"=>"required|integer",
              "price"=>"required|numeric",
              "amount"=>"nullable|numeric",
              "additional_note"=>"nullable|string",
              

            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();



            
            //file uploads

            $customerinvoiceitem = Customerinvoiceitem::create($validated);
            return $this->sendResponse($customerinvoiceitem, "customerinvoiceitem created succesfully");
        } catch (\Exception $e) {
            Log::error('CustomerinvoiceitemController store error: ' . $e->getMessage());
            return $this->sendError("Error creating customerinvoiceitem", ['message' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $customerinvoiceitem = Customerinvoiceitem::findOrFail($id);
        return $this->sendResponse($customerinvoiceitem, "");
    }


    public function update(Request $request, $id)
    {
        try {
            $customerinvoiceitem = Customerinvoiceitem::findOrFail($id);
             $validationRules = [
                //for update

              
              "customer_invoice_id"=>"required|exists:customerinvoices,id",
              "product_id"=>"required|exists:products,id",
              "hs_code"=>"nullable|string|max:255",
              "brand"=>"nullable|string|max:255",
              "brand_code"=>"nullable|string|max:255",
              "oe_code"=>"nullable|string|max:255",
              "description"=>"nullable|string",
              "qty"=>"required|integer",
              "price"=>"required|numeric",
              "amount"=>"nullable|numeric",
              "additional_note"=>"nullable|string",
              
            ];

            $validation = Validator::make($request->all() , $validationRules);
            if($validation->fails()){
                return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
            }
            $validated=$validation->validated();




            //file uploads update

            $customerinvoiceitem->update($validated);
            return $this->sendResponse($customerinvoiceitem, "customerinvoiceitem updated successfully");
        } catch (\Exception $e) {
            Log::error('CustomerinvoiceitemController update error: ' . $e->getMessage());
            return $this->sendError("Error updating customerinvoiceitem", ['message' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $customerinvoiceitem = Customerinvoiceitem::findOrFail($id);
            $customerinvoiceitem->delete();





            //delete files uploaded
            return $this->sendResponse(1, "customerinvoiceitem deleted succesfully");
        } catch (\Exception $e) {
            Log::error('CustomerinvoiceitemController destroy error: ' . $e->getMessage());
            return $this->sendError("Error deleting customerinvoiceitem", ['message' => $e->getMessage()]);
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
