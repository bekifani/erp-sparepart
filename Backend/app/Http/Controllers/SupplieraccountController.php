<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Supplieraccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class SupplieraccountController extends BaseController
{
    protected $searchableColumns = ['date', 'transaction_number', 'invoice_id', 'user_id', 'supplier_id', 'amount', 'invoice', 'payment_status', 'account_type_id', 'payment_note_id', 'picture_url', 'additional_note', 'balance'];

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
        $query = Supplieraccount::orderBy($sortBy, $sortDir);
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
        $supplieraccount = $query->paginate($perPage); 
        $data = [
            "data" => $supplieraccount->toArray(), 
            'current_page' => $supplieraccount->currentPage(),
            'total_pages' => $supplieraccount->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_supplieraccounts(){
        $data = Supplieraccount::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Supplieraccount::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for supplieraccount');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "date"=>"required|date",
          "transaction_number"=>"required|string|unique:supplieraccounts,transaction_number|max:255",
          "invoice_id"=>"nullable|exists:supplier_invoices,id",
          "user_id"=>"nullable|exists:users,id",
          "supplier_id"=>"nullable|exists:suppliers,id",
          "amount"=>"required|numeric",
          "invoice"=>"nullable|string|max:255",
          "payment_status"=>"required|string|max:255",
          "account_type_id"=>"nullable|exists:account_types,id",
          "payment_note_id"=>"nullable|exists:payment_notes,id",
          "picture_url"=>"nullable|string",
          "additional_note"=>"nullable|string",
          "balance"=>"nullable|numeric",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $supplieraccount = Supplieraccount::create($validated);
        return $this->sendResponse($supplieraccount, "supplieraccount created succesfully");
    }

    public function show($id)
    {
        $supplieraccount = Supplieraccount::findOrFail($id);
        return $this->sendResponse($supplieraccount, "");
    }


    public function update(Request $request, $id)
    {
        $supplieraccount = Supplieraccount::findOrFail($id);
         $validationRules = [
            //for update

          
          "date"=>"required|date",
          "transaction_number"=>"required|string|unique:supplieraccounts,transaction_number|max:255",
          "invoice_id"=>"nullable|exists:supplier_invoices,id",
          "user_id"=>"nullable|exists:users,id",
          "supplier_id"=>"nullable|exists:suppliers,id",
          "amount"=>"required|numeric",
          "invoice"=>"nullable|string|max:255",
          "payment_status"=>"required|string|max:255",
          "account_type_id"=>"nullable|exists:account_types,id",
          "payment_note_id"=>"nullable|exists:payment_notes,id",
          "picture_url"=>"nullable|string",
          "additional_note"=>"nullable|string",
          "balance"=>"nullable|numeric",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $supplieraccount->update($validated);
        return $this->sendResponse($supplieraccount, "supplieraccount updated successfully");
    }

    public function destroy($id)
    {
        $supplieraccount = Supplieraccount::findOrFail($id);
        $supplieraccount->delete();





        //delete files uploaded
        return $this->sendResponse(1, "supplieraccount deleted succesfully");
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
