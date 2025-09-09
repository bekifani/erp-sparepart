<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Warehouseaccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class WarehouseaccountController extends BaseController
{
    protected $searchableColumns = ['trans_number', 'user_id', 'warehouse_id', 'supplier_id', 'amount', 'invoice_number', 'payment_status', 'account_type_id', 'payment_note_id', 'picture_url', 'additional_note', 'balance'];

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
        $query = Warehouseaccount::orderBy($sortBy, $sortDir);
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
        $warehouseaccount = $query->paginate($perPage); 
        $data = [
            "data" => $warehouseaccount->toArray(), 
            'current_page' => $warehouseaccount->currentPage(),
            'total_pages' => $warehouseaccount->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_warehouseaccounts(){
        $data = Warehouseaccount::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Warehouseaccount::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for warehouseaccount');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "trans_number"=>"required|string|unique:warehouseaccounts,trans_number|max:50",
          "user_id"=>"nullable|exists:users,id",
          "warehouse_id"=>"nullable|exists:warehouses,id",
          "supplier_id"=>"nullable|exists:suppliers,id",
          "amount"=>"required|numeric",
          "invoice_number"=>"nullable|string|max:100",
          "payment_status"=>"nullable|string|max:50",
          "account_type_id"=>"nullable|exists:account_types,id",
          "payment_note_id"=>"nullable|exists:payment_notes,id",
          "picture_url"=>"nullable|string",
          "additional_note"=>"nullable|string",
          "balance"=>"nullable|numeric|default:0",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $warehouseaccount = Warehouseaccount::create($validated);
        return $this->sendResponse($warehouseaccount, "warehouseaccount created succesfully");
    }

    public function show($id)
    {
        $warehouseaccount = Warehouseaccount::findOrFail($id);
        return $this->sendResponse($warehouseaccount, "");
    }


    public function update(Request $request, $id)
    {
        $warehouseaccount = Warehouseaccount::findOrFail($id);
         $validationRules = [
            //for update

          
          "trans_number"=>"required|string|unique:warehouseaccounts,trans_number|max:50",
          "user_id"=>"nullable|exists:users,id",
          "warehouse_id"=>"nullable|exists:warehouses,id",
          "supplier_id"=>"nullable|exists:suppliers,id",
          "amount"=>"required|numeric",
          "invoice_number"=>"nullable|string|max:100",
          "payment_status"=>"nullable|string|max:50",
          "account_type_id"=>"nullable|exists:account_types,id",
          "payment_note_id"=>"nullable|exists:payment_notes,id",
          "picture_url"=>"nullable|string",
          "additional_note"=>"nullable|string",
          "balance"=>"nullable|numeric|default:0",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $warehouseaccount->update($validated);
        return $this->sendResponse($warehouseaccount, "warehouseaccount updated successfully");
    }

    public function destroy($id)
    {
        $warehouseaccount = Warehouseaccount::findOrFail($id);
        $warehouseaccount->delete();





        //delete files uploaded
        return $this->sendResponse(1, "warehouseaccount deleted succesfully");
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
