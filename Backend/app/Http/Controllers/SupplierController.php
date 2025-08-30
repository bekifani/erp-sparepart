<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class SupplierController extends BaseController
{
    protected $searchableColumns = ['supplier', 'name_surname', 'occupation', 'code', 'address', 'email', 'phone_number', 'whatsapp', 'wechat_id', 'image', 'number_of_products', 'category_of_products', 'name_of_products', 'additional_note'];

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
        $query = Supplier::orderBy($sortBy, $sortDir);
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
        $supplier = $query->paginate($perPage); 
        $data = [
            "data" => $supplier->toArray(), 
            'current_page' => $supplier->currentPage(),
            'total_pages' => $supplier->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_suppliers(){
        $data = Supplier::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Supplier::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for supplier');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "supplier"=>"required|string|max:255",
          "name_surname"=>"required|string|max:255",
          "occupation"=>"nullable|string|max:255",
          "code"=>"nullable|string|max:255",
          "address"=>"nullable|string|max:255",
          "email"=>"required|email|unique:suppliers,email",
          "phone_number"=>"nullable|string|max:20",
          "whatsapp"=>"nullable|string|max:20",
          "wechat_id"=>"nullable|string|max:255",
          "image"=>"nullable|",
          "number_of_products"=>"nullable|numeric",
          "category_of_products"=>"nullable|string|max:255",
          "name_of_products"=>"nullable|string|max:255",
          "additional_note"=>"nullable|string",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $supplier = Supplier::create($validated);
        return $this->sendResponse($supplier, "supplier created succesfully");
    }

    public function show($id)
    {
        $supplier = Supplier::findOrFail($id);
        return $this->sendResponse($supplier, "");
    }


    public function update(Request $request, $id)
    {
        $supplier = Supplier::findOrFail($id);
         $validationRules = [
            //for update

          
          "supplier"=>"required|string|max:255",
          "name_surname"=>"required|string|max:255",
          "occupation"=>"nullable|string|max:255",
          "code"=>"nullable|string|max:255",
          "address"=>"nullable|string|max:255",
          "email"=>"required|email|unique:suppliers,email",
          "phone_number"=>"nullable|string|max:20",
          "whatsapp"=>"nullable|string|max:20",
          "wechat_id"=>"nullable|string|max:255",
          "image"=>"nullable|",
          "number_of_products"=>"nullable|numeric",
          "category_of_products"=>"nullable|string|max:255",
          "name_of_products"=>"nullable|string|max:255",
          "additional_note"=>"nullable|string",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $supplier->update($validated);
        return $this->sendResponse($supplier, "supplier updated successfully");
    }

    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();



$this->deleteFile($supplier->image);

        //delete files uploaded
        return $this->sendResponse(1, "supplier deleted succesfully");
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
