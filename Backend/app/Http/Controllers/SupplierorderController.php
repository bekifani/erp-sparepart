<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Supplierorder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class SupplierorderController extends BaseController
{
    protected $searchableColumns = ['supplier_invoice_no', 'supplier_id', 'order_date', 'expected_date', 'shipping_date', 'order_period', 'arrival_time', 'qty', 'amount', 'discount', 'extra_expenses', 'status_id', 'internal_note', 'customer_note'];

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
        $query = Supplierorder::orderBy($sortBy, $sortDir);
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
        $supplierorder = $query->paginate($perPage); 
        $data = [
            "data" => $supplierorder->toArray(), 
            'current_page' => $supplierorder->currentPage(),
            'total_pages' => $supplierorder->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_supplierorders(){
        $data = Supplierorder::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Supplierorder::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for supplierorder');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "supplier_invoice_no"=>"required|string|max:255",
          "supplier_id"=>"required|exists:suppliers,id",
          "order_date"=>"required|date",
          "expected_date"=>"nullable|date",
          "shipping_date"=>"nullable|date",
          "order_period"=>"nullable|string|max:255",
          "arrival_time"=>"nullable|string|max:255",
          "qty"=>"required|integer",
          "amount"=>"nullable|numeric",
          "discount"=>"nullable|numeric|default:0",
          "extra_expenses"=>"nullable|numeric|default:0",
          "status_id"=>"required|exists:product_statuses,id",
          "internal_note"=>"nullable|string",
          "customer_note"=>"nullable|string",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $supplierorder = Supplierorder::create($validated);
        return $this->sendResponse($supplierorder, "supplierorder created succesfully");
    }

    public function show($id)
    {
        $supplierorder = Supplierorder::findOrFail($id);
        return $this->sendResponse($supplierorder, "");
    }


    public function update(Request $request, $id)
    {
        $supplierorder = Supplierorder::findOrFail($id);
         $validationRules = [
            //for update

          
          "supplier_invoice_no"=>"required|string|max:255",
          "supplier_id"=>"required|exists:suppliers,id",
          "order_date"=>"required|date",
          "expected_date"=>"nullable|date",
          "shipping_date"=>"nullable|date",
          "order_period"=>"nullable|string|max:255",
          "arrival_time"=>"nullable|string|max:255",
          "qty"=>"required|integer",
          "amount"=>"nullable|numeric",
          "discount"=>"nullable|numeric|default:0",
          "extra_expenses"=>"nullable|numeric|default:0",
          "status_id"=>"required|exists:product_statuses,id",
          "internal_note"=>"nullable|string",
          "customer_note"=>"nullable|string",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $supplierorder->update($validated);
        return $this->sendResponse($supplierorder, "supplierorder updated successfully");
    }

    public function destroy($id)
    {
        $supplierorder = Supplierorder::findOrFail($id);
        $supplierorder->delete();





        //delete files uploaded
        return $this->sendResponse(1, "supplierorder deleted succesfully");
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
