<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Supplierpricingrulecustomer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class SupplierpricingrulecustomerController extends BaseController
{
    protected $searchableColumns = ['rule_id', 'customer_id'];

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
        $query = Supplierpricingrulecustomer::orderBy($sortBy, $sortDir);
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
        $supplierpricingrulecustomer = $query->paginate($perPage); 
        $data = [
            "data" => $supplierpricingrulecustomer->toArray(), 
            'current_page' => $supplierpricingrulecustomer->currentPage(),
            'total_pages' => $supplierpricingrulecustomer->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_supplierpricingrulecustomers(){
        $data = Supplierpricingrulecustomer::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Supplierpricingrulecustomer::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for supplierpricingrulecustomer');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "rule_id"=>"required|exists:supplier_pricing_rules,id",
          "customer_id"=>"required|exists:customers,id",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $supplierpricingrulecustomer = Supplierpricingrulecustomer::create($validated);
        return $this->sendResponse($supplierpricingrulecustomer, "supplierpricingrulecustomer created succesfully");
    }

    public function show($id)
    {
        $supplierpricingrulecustomer = Supplierpricingrulecustomer::findOrFail($id);
        return $this->sendResponse($supplierpricingrulecustomer, "");
    }


    public function update(Request $request, $id)
    {
        $supplierpricingrulecustomer = Supplierpricingrulecustomer::findOrFail($id);
         $validationRules = [
            //for update

          
          "rule_id"=>"required|exists:supplier_pricing_rules,id",
          "customer_id"=>"required|exists:customers,id",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $supplierpricingrulecustomer->update($validated);
        return $this->sendResponse($supplierpricingrulecustomer, "supplierpricingrulecustomer updated successfully");
    }

    public function destroy($id)
    {
        $supplierpricingrulecustomer = Supplierpricingrulecustomer::findOrFail($id);
        $supplierpricingrulecustomer->delete();





        //delete files uploaded
        return $this->sendResponse(1, "supplierpricingrulecustomer deleted succesfully");
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
