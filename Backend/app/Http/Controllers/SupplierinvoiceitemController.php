<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Supplierinvoiceitem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class SupplierinvoiceitemController extends BaseController
{
    protected $searchableColumns = ['supplier_invoice_id', 'product_id', 'supplier_code', 'brand', 'brand_code', 'oe_code', 'description', 'qty', 'box_name', 'purchase_price', 'extra_cost', 'amount', 'additional_note', 'status'];

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
        $query = Supplierinvoiceitem::orderBy($sortBy, $sortDir);
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
        $supplierinvoiceitem = $query->paginate($perPage); 
        $data = [
            "data" => $supplierinvoiceitem->toArray(), 
            'current_page' => $supplierinvoiceitem->currentPage(),
            'total_pages' => $supplierinvoiceitem->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_supplierinvoiceitems(){
        $data = Supplierinvoiceitem::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Supplierinvoiceitem::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for supplierinvoiceitem');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "supplier_invoice_id"=>"required|exists:supplierinvoices,id",
          "product_id"=>"required|exists:products,id",
          "supplier_code"=>"nullable|string|max:255",
          "brand"=>"nullable|string|max:255",
          "brand_code"=>"nullable|string|max:255",
          "oe_code"=>"nullable|string|max:255",
          "description"=>"nullable|string",
          "qty"=>"required|integer",
          "box_name"=>"nullable|string|max:255",
          "purchase_price"=>"required|numeric",
          "extra_cost"=>"nullable|numeric|default:0",
          "amount"=>"nullable|numeric",
          "additional_note"=>"nullable|string",
          "status"=>"nullable|string|default:in_warehouse",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $supplierinvoiceitem = Supplierinvoiceitem::create($validated);
        return $this->sendResponse($supplierinvoiceitem, "supplierinvoiceitem created succesfully");
    }

    public function show($id)
    {
        $supplierinvoiceitem = Supplierinvoiceitem::findOrFail($id);
        return $this->sendResponse($supplierinvoiceitem, "");
    }


    public function update(Request $request, $id)
    {
        $supplierinvoiceitem = Supplierinvoiceitem::findOrFail($id);
         $validationRules = [
            //for update

          
          "supplier_invoice_id"=>"required|exists:supplierinvoices,id",
          "product_id"=>"required|exists:products,id",
          "supplier_code"=>"nullable|string|max:255",
          "brand"=>"nullable|string|max:255",
          "brand_code"=>"nullable|string|max:255",
          "oe_code"=>"nullable|string|max:255",
          "description"=>"nullable|string",
          "qty"=>"required|integer",
          "box_name"=>"nullable|string|max:255",
          "purchase_price"=>"required|numeric",
          "extra_cost"=>"nullable|numeric|default:0",
          "amount"=>"nullable|numeric",
          "additional_note"=>"nullable|string",
          "status"=>"nullable|string|default:in_warehouse",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $supplierinvoiceitem->update($validated);
        return $this->sendResponse($supplierinvoiceitem, "supplierinvoiceitem updated successfully");
    }

    public function destroy($id)
    {
        $supplierinvoiceitem = Supplierinvoiceitem::findOrFail($id);
        $supplierinvoiceitem->delete();





        //delete files uploaded
        return $this->sendResponse(1, "supplierinvoiceitem deleted succesfully");
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
