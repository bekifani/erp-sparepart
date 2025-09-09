<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Customeraccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class CustomeraccountController extends BaseController
{
    protected $searchableColumns = ['trans_number', 'user_id', 'amount', 'invoice_number', 'payment_status', 'account_type_id', 'payment_note_id', 'picture_url', 'additional_note', 'balance'];

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
        $query = Customeraccount::orderBy($sortBy, $sortDir);
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
        $customeraccount = $query->paginate($perPage); 
        $data = [
            "data" => $customeraccount->toArray(), 
            'current_page' => $customeraccount->currentPage(),
            'total_pages' => $customeraccount->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_customeraccounts(){
        $data = Customeraccount::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Customeraccount::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for customeraccount');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "trans_number"=>"required|string|unique:customeraccounts,trans_number|max:50",
          "user_id"=>"nullable|exists:users,id",
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

        $customeraccount = Customeraccount::create($validated);
        return $this->sendResponse($customeraccount, "customeraccount created succesfully");
    }

    public function show($id)
    {
        $customeraccount = Customeraccount::findOrFail($id);
        return $this->sendResponse($customeraccount, "");
    }


    public function update(Request $request, $id)
    {
        $customeraccount = Customeraccount::findOrFail($id);
         $validationRules = [
            //for update

          
          "trans_number"=>"required|string|unique:customeraccounts,trans_number|max:50",
          "user_id"=>"nullable|exists:users,id",
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

        $customeraccount->update($validated);
        return $this->sendResponse($customeraccount, "customeraccount updated successfully");
    }

    public function destroy($id)
    {
        $customeraccount = Customeraccount::findOrFail($id);
        $customeraccount->delete();





        //delete files uploaded
        return $this->sendResponse(1, "customeraccount deleted succesfully");
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
