<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class CustomerController extends BaseController
{
    protected $searchableColumns = ['name_surname', 'shipping_mark', 'user_id', 'country', 'address', 'email', 'phone_number', 'whatsapp', 'wechat_id', 'image', 'additional_note'];

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
        $query = Customer::orderBy($sortBy, $sortDir);
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
        $customer = $query->paginate($perPage); 
        $data = [
            "data" => $customer->toArray(), 
            'current_page' => $customer->currentPage(),
            'total_pages' => $customer->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_customers(){
        $data = Customer::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Customer::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for customer');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "name_surname"=>"required|string|max:255",
          "shipping_mark"=>"nullable|string|max:255",
          "user_id"=>"required|exists:users,id",
          "country"=>"nullable|string|max:255",
          "address"=>"nullable|string|max:255",
          "email"=>"required|email|unique:customers,email",
          "phone_number"=>"nullable|string|max:20",
          "whatsapp"=>"nullable|string|max:20",
          "wechat_id"=>"nullable|string|max:255",
          "image"=>"nullable|",
          "additional_note"=>"nullable|string",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $customer = Customer::create($validated);
        return $this->sendResponse($customer, "customer created succesfully");
    }

    public function show($id)
    {
        $customer = Customer::findOrFail($id);
        return $this->sendResponse($customer, "");
    }


    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);
         $validationRules = [
            //for update

          
          "name_surname"=>"required|string|max:255",
          "shipping_mark"=>"nullable|string|max:255",
          "user_id"=>"required|exists:users,id",
          "country"=>"nullable|string|max:255",
          "address"=>"nullable|string|max:255",
          "email"=>"required|email|unique:customers,email",
          "phone_number"=>"nullable|string|max:20",
          "whatsapp"=>"nullable|string|max:20",
          "wechat_id"=>"nullable|string|max:255",
          "image"=>"nullable|",
          "additional_note"=>"nullable|string",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $customer->update($validated);
        return $this->sendResponse($customer, "customer updated successfully");
    }

    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();



$this->deleteFile($customer->image);

        //delete files uploaded
        return $this->sendResponse(1, "customer deleted succesfully");
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
