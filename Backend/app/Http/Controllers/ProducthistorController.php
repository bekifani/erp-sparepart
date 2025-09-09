<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Models\Producthistor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class ProducthistorController extends BaseController
{
    protected $searchableColumns = ['date', 'product_id', 'customer_id'];

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
        $query = Producthistor::orderBy($sortBy, $sortDir);
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
        $producthistor = $query->paginate($perPage); 
        $data = [
            "data" => $producthistor->toArray(), 
            'current_page' => $producthistor->currentPage(),
            'total_pages' => $producthistor->lastPage(),
            'per_page' => $perPage
        ];
        return response()->json($data);
    }

    public function all_producthistors(){
        $data = Producthistor::all();
        return $this->sendResponse($data, 1);
    }

    public function search(Request $request, $search_term){
        $searchTerm = $search_term;
        if (empty($searchTerm)) {
            return response()->json([
                'message' => 'Please enter a search term.'
            ], 400);
        }
        $results = Producthistor::where(function ($query) use ($searchTerm) {
            foreach ($this->searchableColumns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->paginate(20);
        return $this->sendResponse($results , 'search resutls for producthistor');
    }


    public function store(Request $request)
    {
        $validationRules = [
          
          "date"=>"required|date",
          "product_id"=>"required|exists:products,id",
          "customer_id"=>"required|exists:customers,id",
          

        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();



        
        //file uploads

        $producthistor = Producthistor::create($validated);
        return $this->sendResponse($producthistor, "producthistor created succesfully");
    }

    public function show($id)
    {
        $producthistor = Producthistor::findOrFail($id);
        return $this->sendResponse($producthistor, "");
    }


    public function update(Request $request, $id)
    {
        $producthistor = Producthistor::findOrFail($id);
         $validationRules = [
            //for update

          
          "date"=>"required|date",
          "product_id"=>"required|exists:products,id",
          "customer_id"=>"required|exists:customers,id",
          
        ];

        $validation = Validator::make($request->all() , $validationRules);
        if($validation->fails()){
            return $this->sendError("Invalid Values", ['errors' => $validation->errors()]);
        }
        $validated=$validation->validated();




        //file uploads update

        $producthistor->update($validated);
        return $this->sendResponse($producthistor, "producthistor updated successfully");
    }

    public function destroy($id)
    {
        $producthistor = Producthistor::findOrFail($id);
        $producthistor->delete();





        //delete files uploaded
        return $this->sendResponse(1, "producthistor deleted succesfully");
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
